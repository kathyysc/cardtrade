import { useState, useRef } from 'react'
import { uploadAPI } from '../services/api'

/**
 * AI 卡片識別上傳元件
 * 拍照/上傳卡片照片 → 自動識別 → 回傳卡片資訊
 *
 * @param {function} onResult - 識別完成後的回調函數，接收識別結果
 * @param {boolean} disabled - 是否停用
 */
export default function AIRecognitionUpload({ onResult, disabled = false }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // 處理檔案選擇
  const handleFileSelect = (file) => {
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片檔案（JPG、PNG、WebP）')
      return
    }
    // 檢查檔案大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片大小不能超過 5MB')
      return
    }

    setError('')
    setSelectedFile(file)

    // 顯示預覽
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // 拖放事件處理
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  // 開始 AI 識別
  const handleRecognize = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')

    try {
      const response = await uploadAPI.recognize(selectedFile)
      const result = response.data

      if (result.confidence === 0) {
        setError(result.description || '無法識別此卡片，請重新拍攝')
        return
      }

      // 回傳識別結果
      onResult({
        ...result,
        imagePreview: preview,
      })
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || '識識失敗，請稍後再試'
      setError(msg)
    } finally {
      setUploading(false)
    }
  }

  // 重新選擇照片
  const handleReset = () => {
    setPreview(null)
    setSelectedFile(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      {/* 拖放上傳區域 */}
      {!preview ? (
        <div
          className={`upload-zone rounded-xl p-8 text-center cursor-pointer ${
            dragging ? 'dragging' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) handleFileSelect(file)
            }}
          />

          <div className="text-4xl mb-3">📸</div>
          <p className="text-gray-600 font-medium mb-1">
            拍攝或上傳卡片照片
          </p>
          <p className="text-gray-400 text-sm">
            拖放圖片到這裡，或點擊選擇檔案
          </p>
          <p className="text-gray-300 text-xs mt-2">
            支援 JPG、PNG、WebP 格式，最大 5MB
          </p>
        </div>
      ) : (
        /* 圖片預覽 */
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="卡片預覽"
              className="w-full max-w-md mx-auto rounded-xl shadow-md"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
              title="重新選擇"
            >
              ✕
            </button>
          </div>

          {/* 識別按鈕 */}
          <button
            onClick={handleRecognize}
            disabled={uploading || disabled}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                AI 正在識別中...
              </span>
            ) : (
              '🤖 AI 自動識別卡片'
            )}
          </button>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
