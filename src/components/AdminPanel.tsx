import { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, Podcast, Video } from '../types/news';
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const { news, podcasts, videos, addNews, updateNews, deleteNews, addPodcast, updatePodcast, deletePodcast, addVideo, updateVideo, deleteVideo } = useNews();
  const [activeTab, setActiveTab] = useState<'news' | 'podcasts' | 'videos'>('news');
  const [editingItem, setEditingItem] = useState<NewsArticle | Podcast | Video | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const NewsForm = ({ article, onSave, onCancel }: { article?: NewsArticle; onSave: (data: any) => void; onCancel: () => void }) => {
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
      breaking: article?.breaking || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Economía">Economía</option>
              <option value="Salud">Salud</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Urbanismo">Urbanismo</option>
              <option value="Medio Ambiente">Medio Ambiente</option>
              <option value="Educación">Educación</option>
              <option value="Deportes">Deportes</option>
              <option value="Internacionales">Internacionales</option>
              <option value="Nacionales">Nacionales</option>
              <option value="Región">Región</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="economía, gobierno, medidas"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Destacada</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.breaking}
              onChange={(e) => setFormData({ ...formData, breaking: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Último momento</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  const PodcastForm = ({ podcast, onSave, onCancel }: { podcast?: Podcast; onSave: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: podcast?.title || '',
      description: podcast?.description || '',
      duration: podcast?.duration || '',
      image: podcast?.image || '',
      live: podcast?.live || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="45 minutos"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.live}
            onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">En vivo</span>
        </label>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  const VideoForm = ({ video, onSave, onCancel }: { video?: Video; onSave: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: video?.title || '',
      description: video?.description || '',
      thumbnail: video?.thumbnail || '',
      duration: video?.duration || '',
      category: video?.category || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Miniatura</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="15:30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Entrevistas">Entrevistas</option>
              <option value="Reportajes">Reportajes</option>
              <option value="Deportes">Deportes</option>
              <option value="Cultura">Cultura</option>
              <option value="Tecnología">Tecnología</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 bg-white border border-gray-200 text-accent font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition mr-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al sitio
            </button>
            <h1 className="text-3xl font-serif font-black text-accent tracking-tighter">Panel de Gestión</h1>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-6 py-3 bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand transition-all"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Regresar a Edición' : 'Vista Previa'}
          </button>
        </div>

        {!showPreview && (
          <>
            <div className="bg-white border border-gray-200 mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {(['news', 'podcasts', 'videos'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-accent text-white' : 'text-gray-400 hover:text-accent hover:bg-gray-50'}`}
                    >
                      {tab === 'news' ? 'Noticias' : tab === 'podcasts' ? 'Podcasts' : 'Videos'} ({tab === 'news' ? news.length : tab === 'podcasts' ? podcasts.length : videos.length})
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {editingItem && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingItem.id ? 'Editar' : 'Nueva'} {activeTab === 'news' ? 'Noticia' : activeTab === 'podcasts' ? 'Podcast' : 'Video'}
                </h2>
                {activeTab === 'news' && (
                  <NewsForm
                    article={editingItem as NewsArticle}
                    onSave={(data) => {
                      if (editingItem.id) {
                        updateNews(editingItem.id, data);
                      } else {
                        addNews(data);
                      }
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                  />
                )}
                {activeTab === 'podcasts' && (
                  <PodcastForm
                    podcast={editingItem as Podcast}
                    onSave={(data) => {
                      if (editingItem.id) {
                        updatePodcast(editingItem.id, data);
                      } else {
                        addPodcast(data);
                      }
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                  />
                )}
                {activeTab === 'videos' && (
                  <VideoForm
                    video={editingItem as Video}
                    onSave={(data) => {
                      if (editingItem.id) {
                        updateVideo(editingItem.id, data);
                      } else {
                        addVideo(data);
                      }
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                  />
                )}
              </div>
            )}

            {!editingItem && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-xl font-serif font-black text-accent uppercase tracking-tighter">
                    Gestión de {activeTab === 'news' ? 'Noticias' : activeTab === 'podcasts' ? 'Podcasts' : 'Videos'}
                  </h2>
                  <button
                    onClick={() => setEditingItem({} as any)}
                    className="flex items-center px-6 py-4 bg-brand text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Registro
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(activeTab === 'news' ? news : activeTab === 'podcasts' ? podcasts : videos).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {'category' in item ? item.category : 'duration' in item ? item.duration : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {'date' in item ? item.date : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (activeTab === 'news') deleteNews(item.id);
                                else if (activeTab === 'podcasts') deletePodcast(item.id);
                                else deleteVideo(item.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {showPreview && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vista Previa del Sitio</h2>
            <div className="text-sm text-gray-600">
              <p>Esta es una vista previa de cómo se verá el contenido en el sitio público.</p>
              <p className="mt-2">Total de noticias: {news.length}</p>
              <p>Total de podcasts: {podcasts.length}</p>
              <p>Total de videos: {videos.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
