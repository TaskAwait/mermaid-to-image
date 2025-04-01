import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import mermaid from 'mermaid';
import './MermaidToImage.css';

function MermaidToImage() {
  const [mermaidCode, setMermaidCode] = useState(`graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]`);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const mermaidRef = useRef(null);

  // 初始化 Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  }, []);

  // 渲染 Mermaid 图表
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-svg', mermaidCode);
        setSvg(svg);
        setError(null);
      } catch (error) {
        console.error('Error rendering mermaid:', error);
        setError('Mermaid语法错误，请检查并修正您的图表语法');
      }
    };
    
    renderMermaid();
  }, [mermaidCode]);

  // 下载 PNG 图片
  const downloadPng = async () => {
    if (!mermaidRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(mermaidRef.current);
      const link = document.createElement('a');
      link.download = 'mermaid-diagram.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
    }
  };

  // 下载 SVG 图片
  const downloadSvg = () => {
    if (!svg) return;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'mermaid-diagram.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mermaid-container">
      <div className="mermaid-header">
        <h1 className="mermaid-title">Mermaid 图表转图片</h1>
        <p className="mermaid-subtitle">轻松将 Mermaid 图表转换为高质量图片</p>
      </div>
      
      <div className="editor-section">
        <div className="editor-header">
          <h2 className="editor-title">编辑器</h2>
        </div>
        <div className="editor-container">
          <textarea
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            placeholder="输入 Mermaid 语法..."
            spellCheck="false"
          />
        </div>
      </div>
      
      <div className="preview-section">
        <div className="preview-header">
          <h2 className="preview-title">预览</h2>
        </div>
        <div className="preview-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div 
            ref={mermaidRef}
            className="mermaid-preview" 
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        </div>
      </div>
      
      <div className="actions">
        <button 
          className="action-button download-png"
          onClick={downloadPng} 
          disabled={!!error}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          下载 PNG
        </button>
        <button 
          className="action-button download-svg"
          onClick={downloadSvg} 
          disabled={!!error}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          下载 SVG
        </button>
      </div>
    </div>
  );
}

export default MermaidToImage;
