import { Play } from 'lucide-react';

export default function VideoCard({ video }) {
  return (
    <div className="card-hover group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
      <div className="relative overflow-hidden">
        <img src={video.thumbnail} alt={video.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition">
          <div className="play-btn w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-primary-600 ml-0.5" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">{video.duration}</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{video.category}</p>
      </div>
    </div>
  );
}
