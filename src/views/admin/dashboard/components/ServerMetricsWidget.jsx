import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  HardDrive,
  Cpu,
  Activity,
  Database,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap
} from 'lucide-react';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

export default function ServerMetricsWidget() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMetrics = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) return;

      const res = await axios.get(`${baseUrl}/dashboard/system-metrics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.data) {
        setMetrics(res.data.data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch system metrics:', err);
      setError(err.response?.data?.message || 'Failed to fetch server metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchMetrics();
      }, 15000); // refresh every 15s
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  const getStorageBadgeColor = (percentage) => {
    if (percentage > 85) return 'text-error bg-error/10 border-error/30';
    if (percentage > 70) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-success bg-success/10 border-success/30';
  };

  const getStorageBarColor = (percentage) => {
    if (percentage > 85) return 'bg-error';
    if (percentage > 70) return 'bg-warning';
    return 'bg-success';
  };

  if (loading && !metrics) {
    return (
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-base-300 rounded-lg w-48" />
          <div className="h-8 bg-base-300 rounded-xl w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-base-300 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const storage = metrics?.storage || { totalGB: 0, usedGB: 0, freeGB: 0, usedPercentage: 0 };
  const memory = metrics?.memory || { totalMB: 0, usedMB: 0, freeMB: 0, usedPercentage: 0 };
  const cpu = metrics?.cpu || { cores: 0, model: '', loadAvg: [0, 0, 0] };
  const uptime = metrics?.uptime || { seconds: 0, formatted: '-' };
  const database = metrics?.database || { status: 'disconnected', latencyMs: 0 };

  const memoryUsedGB = (memory.usedMB / 1024).toFixed(2);
  const memoryTotalGB = (memory.totalMB / 1024).toFixed(2);

  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-base-content">Server Activity & Resource Monitor</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold border border-primary/20">
                LIVE
              </span>
            </div>
            <p className="text-xs text-base-content/60 mt-0.5">
              Real-time hardware resource usage & system diagnostics
              {lastUpdated && (
                <span className="ml-2 font-mono text-[11px]">
                  • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content/70 bg-base-200 px-3 py-1.5 rounded-xl border border-base-300">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded"
            />
            <span>Auto Refresh (15s)</span>
          </label>

          <button
            type="button"
            onClick={fetchMetrics}
            className="btn btn-square btn-sm btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
            title="Refresh Metrics Now"
          >
            <RefreshCw className={`w-4 h-4 text-base-content ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error/30 text-error text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Storage / Disk Capacity Card */}
        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-300 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase tracking-wider">
              <HardDrive className="w-4 h-4 text-primary" />
              <span>Disk Storage</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStorageBadgeColor(storage.usedPercentage)}`}>
              {storage.usedPercentage}% Used
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold text-base-content tracking-tight">
              {storage.freeGB > 0 ? `${storage.freeGB} GB` : 'N/A'}
              <span className="text-xs font-normal text-base-content/60 ml-1">Free</span>
            </div>
            <div className="text-xs text-base-content/60 mt-0.5">
              {storage.usedGB} GB used of {storage.totalGB} GB Total
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getStorageBarColor(storage.usedPercentage)}`}
              style={{ width: `${Math.min(storage.usedPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. System RAM Card */}
        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-300 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase tracking-wider">
              <Server className="w-4 h-4 text-secondary" />
              <span>RAM Memory</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border text-secondary bg-secondary/10 border-secondary/30">
              {memory.usedPercentage}% Used
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold text-base-content tracking-tight">
              {memoryUsedGB} GB
              <span className="text-xs font-normal text-base-content/60 ml-1">/ {memoryTotalGB} GB</span>
            </div>
            <div className="text-xs text-base-content/60 mt-0.5">
              {memory.freeMB} MB Free Memory Available
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${Math.min(memory.usedPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* 3. CPU Load Card */}
        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-300 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-accent" />
              <span>CPU Processor</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border text-accent bg-accent/10 border-accent/30">
              {cpu.cores} Cores
            </span>
          </div>

          <div>
            <div className="text-xl font-bold text-base-content tracking-tight truncate" title={cpu.model}>
              {cpu.model || 'System CPU'}
            </div>
            <div className="text-xs text-base-content/60 mt-1 flex items-center gap-2">
              <span>Load Avg:</span>
              <span className="font-mono bg-base-300 px-1.5 py-0.5 rounded text-[11px] text-base-content font-bold">
                {cpu.loadAvg?.join(' / ')}
              </span>
            </div>
          </div>

          {/* Core Badge */}
          <div className="flex items-center gap-1 text-[11px] text-base-content/60">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>Active multi-core processing</span>
          </div>
        </div>

        {/* 4. Database & Uptime Card */}
        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-300 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-base-content/70 uppercase tracking-wider">
              <Database className="w-4 h-4 text-success" />
              <span>PostgreSQL & Uptime</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${database.status === 'connected' ? 'text-success bg-success/10 border-success/30' : 'text-error bg-error/10 border-error/30'}`}>
              {database.status === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div>
            <div className="text-xl font-bold text-base-content tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>{uptime.formatted}</span>
            </div>
            <div className="text-xs text-base-content/60 mt-1">
              DB Latency: <span className="font-mono font-bold text-success">{database.latencyMs} ms</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-success font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PostgreSQL Database Healthy</span>
          </div>
        </div>

      </div>
    </div>
  );
}
