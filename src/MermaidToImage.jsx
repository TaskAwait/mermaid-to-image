import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import mermaid from 'mermaid';

function MermaidToImage() {
  const [mermaidCode, setMermaidCode] = useState(`graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]`);
  const [svg, setSvg] = useState('');
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
      } catch (error) {
        console.error('Error rendering mermaid:', error);
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
    <div className="container">
      <h1>Mermaid 图表转图片</h1>
      
      <div className="editor-container">
        <textarea
          value={mermaidCode}
          onChange={(e) => setMermaidCode(e.target.value)}
          placeholder="输入 Mermaid 语法..."
        />
      </div>
      
      <div className="preview-container">
        <h2>预览</h2>
        <div 
          ref={mermaidRef}
          className="mermaid-preview" 
          dangerouslySetInnerHTML={{ __html: svg }} 
        />
      </div>
      
      <div className="actions">
        <button onClick={downloadPng}>下载 PNG</button>
        <button onClick={downloadSvg}>下载 SVG</button>
      </div>
    </div>
  );
}

export default MermaidToImage;
