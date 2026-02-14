import { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, Podcast, Video } from '../types/news';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Radio, PlayCircle, Plus, Edit2, Trash2, LinkIcon, Save, X, Loader2, Monitor, FileText, Eye, EyeOff, ArrowLeft, Upload, Clock, Users } from 'lucide-react';
import Header from './Header';
import FeaturedNews from './FeaturedNews';
import NewsGrid from './NewsGrid';
import PodcastSection from './PodcastSection';
import SportsSection from './SportsSection';
import HighlightSection from './HighlightSection';
import VideosSection from './VideosSection';
import Footer from './Footer';
import NewsDetailPage from './NewsDetailPage';

interface AdminPanelProps {
  onBack: () => void;
}

// Move Form components outside to prevent unmounting on every AdminPanel re-render
const NewsForm = ({ article, onSave, onCancel, setActiveDraft }: {
  article?: NewsArticle;
  onSave: (data: any) => void;
  onCancel: () => void;
  setActiveDraft: (draft: any) => void;
}) => {
  const { uploadFile } = useNews();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    subtitle: article?.subtitle || '',
    content: article?.content || '',
    category: article?.category || '',
    date: article?.date || new Date().toLocaleDateString('es-ES'),
    time: article?.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    image: article?.image || '',
    author: article?.author || 'Redacción',
    tags: article?.tags?.join(', ') || '',
    featured: article?.featured || false,
    breaking: article?.breaking || false,
    links: article?.links || [],
    status: article?.status || 'published'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveDraft({
      ...formData,
      id: article?.id || '',
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : formData.tags
    } as NewsArticle);
  }, [formData, article?.id, setActiveDraft]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'news');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}. Verifique que el bucket "media" sea público y tenga las políticas configuradas.`);
    } finally {
      setIsUploading(false);
    }
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? { ...link, [field]: value } : link)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : formData.tags
      });
      setActiveDraft(null);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setActiveDraft(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título del Artículo</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif font-black text-accent"
            placeholder="Ingrese el título principal..."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtítulo (Opcional)</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif italic text-accent"
            placeholder="Breve bajada o subtítulo..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contenido</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif text-accent"
          placeholder="Escriba el contenido de la noticia aquí..."
          required
        />
      </div>

      {/* Media & Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-y-2 border-gray-50">
        {/* File Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-2">
            <Upload className="h-3 w-3" /> Imagen de Portada
          </label>
          <div className="relative group">
            {formData.image ? (
              <div className="relative h-64 w-full bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-accent px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                    Cambiar Imagen
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand hover:bg-white transition-all cursor-pointer">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-brand animate-spin" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-300 mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seleccionar Imagen</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-10 w-10 text-brand animate-spin" />
              </div>
            )}
          </div>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 bg-transparent text-[9px] font-mono text-gray-400 focus:outline-none"
            placeholder="O pegue una URL directa..."
          />
        </div>

        {/* Links Editor */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-2">
              <LinkIcon className="h-3 w-3" /> Enlaces Relacionados
            </label>
            <button
              type="button"
              onClick={addLink}
              className="text-[9px] font-black uppercase tracking-widest text-accent hover:text-brand flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Agregar
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {formData.links.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-gray-200 rounded">
                <p className="text-[10px] font-medium text-gray-400 italic">No hay enlaces adicionales</p>
              </div>
            ) : (
              formData.links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded border border-gray-100 group">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Etiqueta (ej: Leer más)"
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:border-brand outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL completa (https://...)"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 text-[10px] font-mono focus:border-brand outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black text-[11px] uppercase tracking-widest text-accent"
            required
          >
            <option value="">Seleccionar</option>
            {['Economía', 'Salud', 'Tecnología', 'Urbanismo', 'Medio Ambiente', 'Educación', 'Deportes', 'Internacionales', 'Nacionales', 'Región'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha de Publicación</label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hora</label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Autor</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Etiquetas</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black"
            placeholder="economía, gobierno, medidas"
          />
        </div>
      </div>

      <div className="flex gap-8 p-6 bg-gray-50 border border-gray-100 italic">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 border-2 border-gray-300 rounded text-brand focus:ring-brand"
          />
          <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-accent group-hover:text-brand transition-colors">Noticia Destacada</span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.breaking}
            onChange={(e) => setFormData({ ...formData, breaking: e.target.checked })}
            className="w-4 h-4 border-2 border-gray-300 rounded text-brand focus:ring-brand"
          />
          <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-accent group-hover:text-brand transition-colors">Último Momento</span>
        </label>
      </div>

      <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-4">
        <p className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado de Publicación</p>
        <div className="flex gap-2">
          {[
            { id: 'published', label: 'Publicado', icon: Eye, color: 'brand' },
            { id: 'hidden', label: 'Oculto', icon: EyeOff, color: 'gray-400' },
            { id: 'draft', label: 'Borrador', icon: Clock, color: 'orange-400' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFormData({ ...formData, status: s.id as any })}
              className={`flex items-center px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${formData.status === s.id ? `bg-accent text-white border-accent` : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
            >
              <s.icon className="h-3 w-3 mr-2" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={handleCancel} className="flex items-center px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-accent transition-all">
          <X className="h-4 w-4 mr-2" /> Descartar
        </button>
        <button type="submit" className="flex items-center px-10 py-4 bg-brand text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:shadow-xl transition-all" disabled={isUploading || isSaving}>
          {isSaving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> {isUploading ? 'Subiendo...' : article?.id ? 'Guardar Cambios' : 'Publicar Ahora'}</>
          )}
        </button>
      </div>
    </form>
  );
};

const PodcastForm = ({ podcast, onSave, onCancel, setActiveDraft }: {
  podcast?: Podcast;
  onSave: (data: any) => void;
  onCancel: () => void;
  setActiveDraft: (draft: any) => void;
}) => {
  const { uploadFile } = useNews();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: podcast?.title || '',
    description: podcast?.description || '',
    duration: podcast?.duration || '',
    image: podcast?.image || '',
    link: podcast?.link || '',
    live: podcast?.live || false,
    status: podcast?.status || 'published'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveDraft({
      ...formData,
      id: podcast?.id || ''
    } as Podcast);
  }, [formData, podcast?.id, setActiveDraft]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'podcasts');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}. Verifique que el bucket "media" sea público y tenga las políticas configuradas.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setActiveDraft(null);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setActiveDraft(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título del Podcast</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif font-black text-accent"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif text-accent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-6 border-y border-gray-50">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-2">
            <Upload className="h-3 w-3" /> Imagen de Portada
          </label>
          <div className="relative group aspect-square max-w-[200px]">
            {formData.image ? (
              <div className="relative h-full w-full bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden rounded-lg">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-accent px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                    Cambiar
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-full w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand hover:bg-white transition-all cursor-pointer rounded-lg">
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> : <Upload className="h-6 w-6 text-gray-300" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm rounded-lg">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
              </div>
            )}
          </div>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 bg-transparent text-[9px] font-mono text-gray-400 focus:outline-none"
            placeholder="O pegue URL de imagen..."
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duración</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black"
              placeholder="45 min"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link de Reproducción (URL)</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-mono text-[10px]"
              placeholder="https://spotify.com/... o https://youtube.com/..."
            />
            <p className="text-[9px] text-gray-400 italic">Los enlaces de YouTube se reproducirán automáticamente en el sitio.</p>
          </div>
          <label className="flex items-center cursor-pointer group p-4 bg-gray-50 border border-gray-100 italic rounded">
            <input
              type="checkbox"
              checked={formData.live}
              onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
              className="w-4 h-4 border-2 border-gray-300 rounded text-brand focus:ring-brand"
            />
            <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-accent group-hover:text-brand transition-colors">Transmisión en Vivo</span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-4">
        <p className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado de Publicación</p>
        <div className="flex gap-2">
          {[
            { id: 'published', label: 'Publicado', icon: Eye, color: 'brand' },
            { id: 'hidden', label: 'Oculto', icon: EyeOff, color: 'gray-400' },
            { id: 'draft', label: 'Borrador', icon: Clock, color: 'orange-400' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFormData({ ...formData, status: s.id as any })}
              className={`flex items-center px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${formData.status === s.id ? `bg-accent text-white border-accent` : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
            >
              <s.icon className="h-3 w-3 mr-2" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={handleCancel} className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">Descartar</button>
        <button type="submit" className="px-10 py-4 bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand transition-all shadow-xl shadow-accent/10" disabled={isUploading || isSaving}>
          {isSaving ? 'Guardando...' : isUploading ? 'Subiendo...' : 'Guardar Podcast'}
        </button>
      </div>
    </form>
  );
};

const VideoForm = ({ video, onSave, onCancel, setActiveDraft }: {
  video?: Video;
  onSave: (data: any) => void;
  onCancel: () => void;
  setActiveDraft: (draft: any) => void;
}) => {
  const { uploadFile } = useNews();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    thumbnail: video?.thumbnail || '',
    duration: video?.duration || '',
    category: video?.category || '',
    status: video?.status || 'published'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveDraft({
      ...formData,
      id: video?.id || ''
    } as Video);
  }, [formData, video?.id, setActiveDraft]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'videos');
      setFormData(prev => ({ ...prev, thumbnail: url }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Error al subir la miniatura: ${error.message || 'Error desconocido'}. Verifique que el bucket "media" sea público y tenga las políticas configuradas.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setActiveDraft(null);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setActiveDraft(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título del Video</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif font-black text-accent"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-serif text-accent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-6 border-y border-gray-50">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-2">
            <Upload className="h-3 w-3" /> Miniatura del Video
          </label>
          <div className="relative group aspect-video">
            {formData.thumbnail ? (
              <div className="relative h-full w-full bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden rounded-lg">
                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-accent px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                    Cambiar
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-full w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand hover:bg-white transition-all cursor-pointer rounded-lg">
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> : <Upload className="h-6 w-6 text-gray-300" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm rounded-lg">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
              </div>
            )}
          </div>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="w-full px-4 py-2 bg-transparent text-[9px] font-mono text-gray-400 focus:outline-none"
            placeholder="O pegue URL de miniatura..."
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duración</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black text-[12px]"
              placeholder="15:30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black text-[11px] uppercase tracking-widest"
              required
            >
              <option value="">Seleccionar</option>
              {['Entrevistas', 'Reportajes', 'Deportes', 'Cultura', 'Tecnología'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-4">
        <p className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado de Publicación</p>
        <div className="flex gap-2">
          {[
            { id: 'published', label: 'Publicado', icon: Eye, color: 'brand' },
            { id: 'hidden', label: 'Oculto', icon: EyeOff, color: 'gray-400' },
            { id: 'draft', label: 'Borrador', icon: Clock, color: 'orange-400' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFormData({ ...formData, status: s.id as any })}
              className={`flex items-center px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${formData.status === s.id ? `bg-accent text-white border-accent` : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
            >
              <s.icon className="h-3 w-3 mr-2" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={handleCancel} className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">Descartar</button>
        <button type="submit" className="px-10 py-4 bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand transition-all shadow-xl shadow-accent/10" disabled={isUploading || isSaving}>
          {isSaving ? 'Guardando...' : isUploading ? 'Subiendo...' : 'Guardar Video'}
        </button>
      </div>
    </form>
  );
};

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { news, podcasts, videos, addNews, updateNews, deleteNews, addPodcast, updatePodcast, deletePodcast, addVideo, updateVideo, deleteVideo, setIsPreviewMode, clearChanges, changedIds, setActiveDraft, isLoading, activeDraft } = useNews();
  const [activeTab, setActiveTab] = useState<'news' | 'podcasts' | 'videos' | 'subscribers'>('news');
  const [editingItem, setEditingItem] = useState<NewsArticle | Podcast | Video | null>(null);
  const [subscribers, setSubscribers] = useState<{ id: string, email: string, created_at: string }[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    }
  }, [activeTab]);

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const { data, error } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('¿Eliminar suscriptor?')) return;
    try {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) throw error;
      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'home' | 'article'>('home');

  const handleShowPreview = (value: boolean) => {
    setShowPreview(value);
    setIsPreviewMode(value);
    if (value) {
      setPreviewType('home'); // Reset to home when entering preview mode
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Sincronizando con Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${showPreview ? 'bg-white' : 'bg-[#fcfcfc]'}`}>
      <div className={`${showPreview ? '' : 'max-w-[1400px] mx-auto px-6 py-12'}`}>
        {!showPreview && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 border-b-4 border-accent pb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-brand text-white p-2">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Workspace v2.0</span>
              </div>
              <h1 className="text-6xl font-serif font-black text-accent tracking-tighter leading-none uppercase">Editor Web</h1>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex items-center px-8 py-5 bg-white border-2 border-accent text-accent font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-3" /> Sitio Público
              </button>
              <button
                onClick={() => handleShowPreview(true)}
                className="flex items-center px-10 py-5 bg-brand text-white font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-brand/20 transition-all transform hover:-translate-y-1"
              >
                <Eye className="h-4 w-4 mr-3" /> Vista Previa Real
              </button>
            </div>
          </div>
        )}

        {showPreview && (
          <div className="animate-in fade-in duration-700">
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex gap-2 bg-accent/90 backdrop-blur-md p-2 shadow-2xl border border-white/10">
              <button
                onClick={() => setPreviewType('home')}
                className={`flex items-center px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${previewType === 'home' ? 'bg-brand text-white' : 'text-white/60 hover:text-white'}`}
              >
                <Monitor className="h-4 w-4 mr-2" /> Portada
              </button>
              {activeTab === 'news' && editingItem && (
                <button
                  onClick={() => setPreviewType('article')}
                  className={`flex items-center px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${previewType === 'article' ? 'bg-brand text-white' : 'text-white/60 hover:text-white'}`}
                >
                  <FileText className="h-4 w-4 mr-2" /> Artículo
                </button>
              )}
              <div className="w-px bg-white/10 mx-2" />
              <button
                onClick={() => handleShowPreview(false)}
                className="flex items-center px-6 py-3 text-white/60 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all"
              >
                <Edit2 className="h-4 w-4 mr-2" /> Salir
              </button>
            </div>
            <div className="relative border-x border-gray-100 bg-white">
              {previewType === 'article' && activeTab === 'news' && activeDraft ? (
                <NewsDetailPage previewArticle={activeDraft as NewsArticle} />
              ) : (
                <>
                  <Header />
                  <FeaturedNews />
                  <NewsGrid />
                  <PodcastSection />
                  <SportsSection />
                  <HighlightSection />
                  <VideosSection />
                  <Footer />
                </>
              )}
            </div>
          </div>
        )}

        {!showPreview && (
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-80 space-y-6">
              <div className="bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                  <div className="w-1.5 h-6 bg-brand"></div>
                  <h2 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Gestión de Contenidos</h2>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('news'); setEditingItem(null); }}
                    className={`w-full group relative flex items-center justify-between px-6 py-5 transition-all duration-300 border ${activeTab === 'news' ? 'bg-accent border-accent text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 transition-colors ${activeTab === 'news' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-accent group-hover:text-white'}`}>
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Noticias</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 transition-opacity ${activeTab === 'news' ? 'opacity-60' : ''}`}>Artículos y Reportajes</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{news.length}</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('podcasts'); setEditingItem(null); }}
                    className={`w-full group relative flex items-center justify-between px-6 py-5 transition-all duration-300 border ${activeTab === 'podcasts' ? 'bg-accent border-accent text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 transition-colors ${activeTab === 'podcasts' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-accent group-hover:text-white'}`}>
                        <Radio className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Podcasts</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 transition-opacity ${activeTab === 'podcasts' ? 'opacity-60' : ''}`}>Episodios Semanales</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{podcasts.length}</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('videos'); setEditingItem(null); }}
                    className={`w-full group relative flex items-center justify-between px-6 py-5 transition-all duration-300 border ${activeTab === 'videos' ? 'bg-accent border-accent text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 transition-colors ${activeTab === 'videos' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-accent group-hover:text-white'}`}>
                        <PlayCircle className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Videos</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 transition-opacity ${activeTab === 'videos' ? 'opacity-60' : ''}`}>Contenido Multimedia</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{videos.length}</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('subscribers'); setEditingItem(null); }}
                    className={`w-full group relative flex items-center justify-between px-6 py-5 transition-all duration-300 border ${activeTab === 'subscribers' ? 'bg-accent border-accent text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 transition-colors ${activeTab === 'subscribers' ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-accent group-hover:text-white'}`}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Suscriptores</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 transition-opacity ${activeTab === 'subscribers' ? 'opacity-60' : ''}`}>Lista de Correo</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black opacity-30">{subscribers.length}</span>
                  </button>
                </div>

                {changedIds.size > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Estado del Servidor</p>
                    <button
                      onClick={clearChanges}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all border border-red-100 hover:border-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Limpiar Marcas ({changedIds.size})
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-accent p-8 text-white">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand">Seguridad</h3>
                <p className="text-[9px] font-bold text-white/50 leading-relaxed tracking-wider uppercase">Sesión de administrador activa. Todos los cambios se registran directamente en la DataBase.</p>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {activeTab === 'subscribers' ? (
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-gray-50">
                    <div>
                      <h2 className="text-2xl font-serif font-black text-accent uppercase tracking-tighter">Lista de Suscriptores</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Usuarios interesados en el boletín</p>
                    </div>
                    <button onClick={fetchSubscribers} className="text-[10px] font-black uppercase tracking-widest text-brand hover:text-accent transition-colors">Actualizar Lista</button>
                  </div>

                  {isLoadingSubscribers ? (
                    <div className="py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargando correos...</p>
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 italic">
                      <p className="text-[10px] font-medium text-gray-400">No hay suscriptores registrados aún.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Correo Electrónico</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Fecha de Registro</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {subscribers.map((sub) => (
                            <tr key={sub.id} className="group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-6 font-bold text-accent">{sub.email}</td>
                              <td className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {new Date(sub.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-6">
                                <button
                                  onClick={() => deleteSubscriber(sub.id)}
                                  className="p-3 bg-white border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : editingItem ? (
                <div className="bg-white border-2 border-accent p-10 shadow-2xl">
                  <h2 className="text-3xl font-serif font-black text-accent uppercase tracking-tighter mb-10 pb-6 border-b border-gray-100">
                    {editingItem.id ? 'Editando' : 'Nuevo'} {activeTab === 'news' ? 'Artículo' : activeTab === 'podcasts' ? 'Capítulo' : 'Video'}
                  </h2>
                  {activeTab === 'news' && <NewsForm article={editingItem as NewsArticle} setActiveDraft={setActiveDraft} onSave={async (data) => {
                    try {
                      if (editingItem.id) await updateNews(editingItem.id, data);
                      else await addNews(data);
                      setEditingItem(null);
                    } catch (error: any) {
                      console.error('Error saving news:', error);
                      alert('Error al guardar la noticia: ' + (error.message || 'Error desconocido'));
                    }
                  }} onCancel={() => setEditingItem(null)} />}
                  {activeTab === 'podcasts' && <PodcastForm podcast={editingItem as Podcast} setActiveDraft={setActiveDraft} onSave={async (data) => {
                    try {
                      if (editingItem.id) await updatePodcast(editingItem.id, data);
                      else await addPodcast(data);
                      setEditingItem(null);
                    } catch (error: any) {
                      console.error('Error saving podcast:', error);
                      alert('Error al guardar el podcast: ' + (error.message || 'Error desconocido'));
                    }
                  }} onCancel={() => setEditingItem(null)} />}
                  {activeTab === 'videos' && <VideoForm video={editingItem as Video} setActiveDraft={setActiveDraft} onSave={async (data) => {
                    try {
                      if (editingItem.id) await updateVideo(editingItem.id, data);
                      else await addVideo(data);
                      setEditingItem(null);
                    } catch (error: any) {
                      console.error('Error saving video:', error);
                      alert('Error al guardar el video: ' + (error.message || 'Error desconocido'));
                    }
                  }} onCancel={() => setEditingItem(null)} />}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-gray-50">
                    <div>
                      <h2 className="text-2xl font-serif font-black text-accent uppercase tracking-tighter">Listado General</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ultimas actualizaciones del servidor</p>
                    </div>
                    <button onClick={() => setEditingItem({} as any)} className="flex items-center px-8 py-5 bg-brand text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:shadow-xl transition-all">
                      <Plus className="h-4 w-4 mr-3" /> Crear Nuevo
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Contenido / Título</th>
                          <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Info / Categoría</th>
                          <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(activeTab === 'news' ? news : activeTab === 'podcasts' ? podcasts : videos).map((item) => {
                          const isHidden = item.status === 'hidden';
                          const isPending = item.status === 'pending' || item.status === 'draft';

                          return (
                            <tr key={item.id} className={`group hover:bg-gray-50/50 transition-colors ${isHidden ? 'opacity-50' : ''}`}>
                              <td className="px-6 py-6">
                                <div className="flex items-center gap-4">
                                  {isHidden && <EyeOff className="h-4 w-4 text-gray-400 shrink-0" />}
                                  <div>
                                    <span className={`block text-md font-serif font-black leading-tight group-hover:text-brand transition-colors ${isHidden ? 'text-gray-400' : 'text-accent'}`}>{item.title}</span>
                                    {'date' in item && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 block">Publicado el {item.date}</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <div className="flex flex-col gap-2">
                                  <span className="inline-block w-fit px-3 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-accent">
                                    {'category' in item ? item.category : 'duration' in item ? item.duration : 'Multimedia'}
                                  </span>
                                  {isHidden && (
                                    <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                      <EyeOff className="h-3 w-3" /> Oculto
                                    </span>
                                  )}
                                  {isPending && (
                                    <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-400">
                                      <Clock className="h-3 w-3" /> Pendiente
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => {
                                      const newStatus = isHidden ? 'published' : 'hidden';
                                      if (activeTab === 'news') updateNews(item.id, { status: newStatus });
                                      else if (activeTab === 'podcasts') updatePodcast(item.id, { status: newStatus });
                                      else updateVideo(item.id, { status: newStatus });
                                    }}
                                    className={`p-3 border transition-all shadow-sm ${isHidden ? 'bg-accent text-white border-accent hover:bg-brand hover:border-brand' : 'bg-white border-gray-200 text-gray-400 hover:border-brand hover:text-brand'}`}
                                    title={isHidden ? 'Mostrar' : 'Ocultar'}
                                  >
                                    {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                  </button>
                                  <button onClick={() => setEditingItem(item)} className="p-3 bg-white border border-gray-200 text-accent hover:border-brand hover:text-brand transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button>
                                  <button onClick={() => { if (confirm('¿Eliminar?')) { if (activeTab === 'news') deleteNews(item.id); else if (activeTab === 'podcasts') deletePodcast(item.id); else deleteVideo(item.id); } }} className="p-3 bg-white border border-gray-200 text-gray-300 hover:border-brand hover:text-brand transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
