"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DataDescription from './TempoVisualization/DataDescription';
import LoadingState from './TempoVisualization/LoadingState';
import EmptyState from './TempoVisualization/EmptyState';
import ErrorDisplay from './TempoVisualization/ErrorDisplay';
import VisualizationCard from './TempoVisualization/VisualizationCard';
import VisualizationForm from './TempoVisualization/VisualizationForm';
import HelpContent from './TempoVisualization/HelpContent';

interface TempoData {
  success: boolean;
  data?: {
    image_base64: string;
    job_id: string;
    variable: string;
    files_processed: number;
    bbox?: number[];
  };
  message: string;
}

interface AllThreeData {
  success: boolean;
  data?: {
    job_id: string;
    variable: string;
    files_processed: number;
    visualizations: {
      [key: string]: {
        success: boolean;
        image_base64?: string;
        error?: string;
      };
    };
    success_count: number;
    total_count: number;
    bbox?: number[];
  };
  message: string;
}

export default function TempoVisualization() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [result, setResult] = useState<{
    type: 'single' | 'all_three';
    data: TempoData | AllThreeData;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'visualize' | 'help'>('explore');
  const [, setCurrentJobId] = useState<string | null>(null);
  interface JobStatus {
    status: string;
    progress: number;
    completed_plots: string[];
    failed_plots: string[];
    results?: Record<string, unknown>;
    error?: string;
  }

  interface PlotData {
    success: boolean;
    image_base64?: string;
    error?: string;
  }

  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);

  const [formData, setFormData] = useState({
    startTime: '2023-12-30T22:30',
    endTime: '2023-12-30T22:45',
    bbox: '-150, -40, 14, 65',
    variable: 'product/vertical_column',
    plotType: 'map'
  });

  const plotNames = {
    map: "Geographic Map",
    zonal_mean: "Zonal Mean Plot", 
    contour: "Contour Plot"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Pre-load data when component mounts
  useEffect(() => {
    const preloadData = async () => {
      try {
        setIsPreloading(true);
        setLoadingMessage('Loading sample data...');
        
        // First test API connection
        const healthResponse = await fetch('/api/health');
        if (!healthResponse.ok) {
          throw new Error('API is not available');
        }
        
        // Load all three visualizations using the optimized endpoint
        const sampleData = {
          start_time: formData.startTime + ':00',
          end_time: formData.endTime + ':00',
          plot_type: 'all_three',
          variable: formData.variable,
          collection_id: 'C2930730944-LARC_CLOUD',
          bbox: [-150, -40, 14, 65] // Default bounding box for North America
        };

        setLoadingMessage('Generating sample visualizations...');
        
        const response = await fetch('/api/tempo/visualize/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sampleData)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Preload response:', data); // Debug logging
          
          if (data.success && data.data && data.data.visualizations) {
            setResult({
              type: 'all_three',
              data: {
                success: true,
                data: {
                  job_id: data.data.job_id || 'preload',
                  variable: formData.variable,
                  files_processed: data.data.files_processed || 1,
                  visualizations: data.data.visualizations,
                  success_count: data.data.success_count || Object.keys(data.data.visualizations).length,
                  total_count: data.data.total_count || Object.keys(data.data.visualizations).length,
                  bbox: data.data.bbox || [-150, -40, 14, 65]
                },
                message: `Generated ${data.data.success_count || Object.keys(data.data.visualizations).length} visualizations successfully`
              }
            });
            setIsInitialLoad(false);
            
            // Update form with the bounding box values used
            setFormData(prev => ({
              ...prev,
              bbox: '-150, -40, 14, 65'
            }));
          } else {
            throw new Error(data.message || 'Failed to generate sample data');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API responded with status ${response.status}`);
        }
      } catch (err) {
        console.log('Pre-load failed (this is normal if NASA credentials are not set):', err);
        // Don't show error for pre-load failure, just show empty state
        setError(null);
        setIsInitialLoad(true);
      } finally {
        setIsPreloading(false);
        setLoadingMessage('');
      }
    };

    preloadData();
  }, [formData.startTime, formData.endTime, formData.variable]); // Include dependencies

  const startParallelProcessing = async (plotTypes: string[]) => {
    try {
      // Parse bounding box if provided
      let bboxArray = null;
      if (formData.bbox.trim()) {
        const bboxParts = formData.bbox.split(',').map(part => parseFloat(part.trim()));
        if (bboxParts.length !== 4 || bboxParts.some(isNaN)) {
          throw new Error('Bounding box must be in format: west, south, east, north (e.g., -150, -40, 14, 65)');
        }
        bboxArray = bboxParts;
      }

      const requestData: Record<string, unknown> = {
        start_time: formData.startTime + ':00',
        end_time: formData.endTime + ':00',
        plot_types: plotTypes,
        variables: [formData.variable],
        collection_id: 'C2930730944-LARC_CLOUD'
      };

      if (bboxArray) {
        requestData.bbox = bboxArray;
      }

      const response = await fetch('/api/tempo/visualize/parallel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentJobId(data.job_id);
          setJobStatus({
            status: 'queued',
            progress: 0,
            completed_plots: [],
            failed_plots: [],
            results: {}
          });
          return data.job_id;
        } else {
          throw new Error(data.message || 'Failed to start parallel processing');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API responded with status ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const checkJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/tempo/visualize/status/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobStatus(data);
        return data;
      } else {
        throw new Error(`Failed to check job status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error checking job status:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsInitialLoad(false);
    setError(null);
    setResult(null);
    setCurrentJobId(null);
    setJobStatus(null);

    try {
      // Validate form data
      if (!formData.startTime || !formData.endTime) {
        throw new Error('Please select both start and end times');
      }

      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      
      if (startDate >= endDate) {
        throw new Error('End time must be after start time');
      }

      if (formData.plotType === 'all_three') {
        // Use the optimized endpoint for all three visualizations
        setLoadingMessage('Generating all three visualizations...');
        
        const requestData: Record<string, unknown> = {
          start_time: formData.startTime + ':00',
          end_time: formData.endTime + ':00',
          plot_type: 'all_three',
          variable: formData.variable,
          collection_id: 'C2930730944-LARC_CLOUD'
        };

        // Add bounding box if provided
        const bboxArray = formData.bbox ? formData.bbox.split(',').map(x => parseFloat(x.trim())) : null;
        if (bboxArray && bboxArray.length === 4) {
          requestData.bbox = bboxArray;
        }

        const response = await fetch('/api/tempo/visualize/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('All three response:', data); // Debug logging
          
          if (data.success && data.data && data.data.visualizations) {
            setResult({
              type: 'all_three',
              data: {
                success: true,
                data: {
                  job_id: data.data.job_id || 'all_three',
                  variable: formData.variable,
                  files_processed: data.data.files_processed || 1,
                  visualizations: data.data.visualizations,
                  success_count: data.data.success_count || Object.keys(data.data.visualizations).length,
                  total_count: data.data.total_count || Object.keys(data.data.visualizations).length,
                  bbox: data.data.bbox
                },
                message: `Generated ${data.data.success_count || Object.keys(data.data.visualizations).length} visualizations successfully`
              }
            });
            setIsLoading(false);
            setLoadingMessage('');
          } else {
            throw new Error(data.message || 'Failed to generate visualizations');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API responded with status ${response.status}`);
        }
      } else {
        // Use single processing for individual plots
        const jobId = await startParallelProcessing([formData.plotType]);
        if (jobId) {
          setLoadingMessage(`Generating ${plotNames[formData.plotType as keyof typeof plotNames]}...`);
          // Start polling for status
          const pollInterval = setInterval(async () => {
            const status = await checkJobStatus(jobId);
            if (status && (status.status === 'completed' || status.status === 'failed')) {
              clearInterval(pollInterval);
              setIsLoading(false);
              setLoadingMessage('');
              
              if (status.status === 'completed') {
                setResult({
                  type: 'single',
                  data: {
                    success: true,
                    data: {
                      image_base64: status.results[formData.plotType]?.image_base64 || '',
                      job_id: jobId,
                      variable: formData.variable,
                      files_processed: 1
                    },
                    message: `Generated ${formData.plotType} visualization successfully`
                  }
                });
              } else {
                setError(status.error || 'Job failed');
              }
            }
          }, 2000); // Poll every 2 seconds
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Testing API connection...');

    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setResult({
          type: 'single',
          data: {
            success: true,
            message: `API is healthy! Status: ${data.status}`,
            data: {
              image_base64: '',
              job_id: '',
              variable: '',
              files_processed: 0
            }
          }
        });
      } else {
        throw new Error(`API responded with status ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to API');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    if (result) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    } else {
      testConnection();
    }
  };


  return (
    <section className="w-full bg-[var(--deep-blue)] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            NASA TEMPO Data Visualization
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explore atmospheric pollution data from NASA&apos;s TEMPO satellite mission. 
            Generate interactive visualizations to understand air quality patterns across North America.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white/10 rounded-xl p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'explore' 
                  ? 'bg-[var(--neon-yellow)] text-[var(--deep-blue)]' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Explore Data
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'visualize' 
                  ? 'bg-[var(--neon-yellow)] text-[var(--deep-blue)]' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Create Visualization
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'help' 
                  ? 'bg-[var(--neon-yellow)] text-[var(--deep-blue)]' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Help & Info
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'explore' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Sample TEMPO Visualizations</h3>
            
            {isLoading || isPreloading ? (
              <LoadingState 
                isPreloading={isPreloading}
                loadingMessage={loadingMessage}
                jobStatus={jobStatus}
              />
            ) : isInitialLoad ? (
              <EmptyState 
                onStartVisualizing={() => setActiveTab('visualize')}
                onLearnMore={() => setActiveTab('help')}
              />
            ) : (
              <div className="space-y-8">
                {error && (
                  <ErrorDisplay 
                    error={error}
                    retryCount={retryCount}
                    onRetry={handleRetry}
                  />
                )}

                {result && result.type === 'all_three' && result.data.success && result.data.data && 'visualizations' in result.data.data && (
                  <div className="space-y-8">
                    <DataDescription
                      startTime={formData.startTime}
                      endTime={formData.endTime}
                      bbox={result.data.data.bbox}
                      variable={formData.variable}
                    />
                    
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">Sample Data Generated Successfully</h4>
                      <p className="text-white/70">
                        Showing {result.data.data.success_count}/{result.data.data.total_count} visualizations
                      </p>
                    </div>

                    <div className="grid gap-8">
                      {Object.entries(result.data.data.visualizations || {}).map(([plotType, plotData]: [string, PlotData]) => (
                        <VisualizationCard
                          key={plotType}
                          plotType={plotType}
                          plotData={plotData}
                          plotNames={plotNames}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {result && result.type === 'single' && result.data.success && result.data.data && 'image_base64' in result.data.data && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">Visualization Generated</h4>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Success
                      </span>
                    </div>
                    
                    {result.data.data.image_base64 && (
                      <div className="text-center">
                        <Image
                          src={`data:image/png;base64,${result.data.data.image_base64}`}
                          alt="TEMPO Visualization"
                          width={800}
                          height={600}
                          className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visualize' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Create Custom Visualization</h3>
            
            <VisualizationForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onTestConnection={testConnection}
              isLoading={isLoading}
            />

            {/* Results Section */}
            {isLoading ? (
              <LoadingState 
                isPreloading={isPreloading}
                loadingMessage={loadingMessage}
                jobStatus={jobStatus}
              />
            ) : isInitialLoad ? (
              <EmptyState 
                onStartVisualizing={() => setActiveTab('visualize')}
                onLearnMore={() => setActiveTab('help')}
              />
            ) : (
              <div className="mt-8 space-y-8">
                {error && (
                  <ErrorDisplay 
                    error={error}
                    retryCount={retryCount}
                    onRetry={handleRetry}
                  />
                )}

                {result && result.type === 'all_three' && result.data.success && result.data.data && 'visualizations' in result.data.data && (
                  <div className="space-y-8">
                    <DataDescription
                      startTime={formData.startTime}
                      endTime={formData.endTime}
                      bbox={result.data.data.bbox}
                      variable={formData.variable}
                    />
                    
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-2">All Visualizations Generated Successfully</h4>
                      <p className="text-white/70">
                        Showing {result.data.data.success_count}/{result.data.data.total_count} visualizations
                      </p>
                    </div>

                    <div className="grid gap-8">
                      {Object.entries(result.data.data.visualizations || {}).map(([plotType, plotData]: [string, PlotData]) => (
                        <VisualizationCard
                          key={plotType}
                          plotType={plotType}
                          plotData={plotData}
                          plotNames={plotNames}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {result && result.type === 'single' && result.data.success && result.data.data && 'image_base64' in result.data.data && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">Visualization Generated</h4>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Success
                      </span>
                    </div>
                    
                    {result.data.data.image_base64 && (
                      <div className="text-center">
                        <Image
                          src={`data:image/png;base64,${result.data.data.image_base64}`}
                          alt="TEMPO Visualization"
                          width={900}
                          height={675}
                          className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'help' && <HelpContent />}
      </div>
    </section>
  );
}