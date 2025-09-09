import { Play, Clock, TrendingUp, Heart, Shuffle, MoreHorizontal } from "lucide-react"

export function MusicPlayerHome() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-orange-400/25 to-red-400/25 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-20 w-28 h-28 bg-gradient-to-r from-orange-600/15 to-amber-600/15 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Welcome Header with Animated Headset */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full p-6 backdrop-blur-xl border border-white/30 shadow-2xl shadow-orange-500/20">
                <div className="w-full h-full bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center relative overflow-hidden border border-white/10">
                  {/* Headset Icon */}
                  <div className="text-orange-400 text-4xl">🎧</div>

                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      {[8, 16, 12, 20, 6].map((height, index) => (
                        <div
                          key={index}
                          className="w-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-full animate-pulse"
                          style={{
                            height: `${height}px`,
                            animationDelay: `${index * 150}ms`,
                            animationDuration: "1.5s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Left Sound Waves */}
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      {[6, 18, 10, 14].map((height, index) => (
                        <div
                          key={index}
                          className="w-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-full animate-pulse"
                          style={{
                            height: `${height}px`,
                            animationDelay: `${(index + 1) * 100}ms`,
                            animationDuration: "1.5s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
            Welcome back!
          </h1>
          <p className="text-white/80 text-lg">Ready to discover your next favorite song?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-4 hover:bg-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group shadow-lg">
            <Shuffle className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Shuffle Play</span>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-4 hover:bg-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group shadow-lg">
            <Heart className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Liked Songs</span>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-4 hover:bg-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group shadow-lg">
            <Clock className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Recently Played</span>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-4 hover:bg-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group shadow-lg">
            <TrendingUp className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Trending</span>
          </button>
        </div>

        {/* Recently Played */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Recently Played
            </h2>
            <button className="text-white/60 hover:text-orange-400 transition-colors">Show all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Midnight Vibes", artist: "Lo-Fi Collective", plays: "2 hours ago" },
              { title: "Summer Hits", artist: "Various Artists", plays: "Yesterday" },
              { title: "Focus Flow", artist: "Ambient Sounds", plays: "3 days ago" },
              { title: "Workout Energy", artist: "Pump Music", plays: "1 week ago" },
              { title: "Chill Evening", artist: "Relaxation", plays: "2 weeks ago" },
              { title: "Road Trip", artist: "Classic Rock", plays: "1 month ago" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 group cursor-pointer shadow-lg"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden border border-white/10">
                  <div className="text-2xl">🎵</div>
                  <button className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-orange-400" />
                  </button>
                </div>
                <h3 className="font-medium text-sm mb-1 truncate">{item.title}</h3>
                <p className="text-white/70 text-xs truncate">{item.artist}</p>
                <p className="text-orange-400/60 text-xs mt-1">{item.plays}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Made For You
            </h2>
            <button className="text-white/60 hover:text-orange-400 transition-colors">Show all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discover Weekly",
                description: "Your weekly mixtape of fresh music",
                gradient: "from-orange-500 to-amber-500",
                icon: "🔍",
              },
              {
                title: "Daily Mix 1",
                description: "Ed Sheeran, Taylor Swift, and more",
                gradient: "from-orange-600 to-red-500",
                icon: "🎯",
              },
              {
                title: "Release Radar",
                description: "Catch all the latest music from artists you follow",
                gradient: "from-amber-500 to-orange-600",
                icon: "📡",
              },
            ].map((playlist, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 group cursor-pointer shadow-lg"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${playlist.gradient} rounded-xl mb-4 flex items-center justify-center text-2xl relative overflow-hidden border border-white/20 shadow-lg`}
                >
                  <span>{playlist.icon}</span>
                  <button className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-2">{playlist.title}</h3>
                <p className="text-white/70 text-sm">{playlist.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Top Charts
            </h2>
            <button className="text-white/60 hover:text-orange-400 transition-colors">Show all</button>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              {[
                { rank: 1, title: "Blinding Lights", artist: "The Weeknd", plays: "2.8B plays" },
                { rank: 2, title: "Shape of You", artist: "Ed Sheeran", plays: "2.6B plays" },
                { rank: 3, title: "Someone You Loved", artist: "Lewis Capaldi", plays: "2.1B plays" },
                { rank: 4, title: "Sunflower", artist: "Post Malone, Swae Lee", plays: "1.9B plays" },
                { rank: 5, title: "Dance Monkey", artist: "Tones and I", plays: "1.8B plays" },
              ].map((track, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-500/10 hover:backdrop-blur-md transition-all duration-300 group cursor-pointer border border-transparent hover:border-orange-400/20"
                >
                  <span className="text-orange-400 font-bold text-lg w-6">{track.rank}</span>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-lg">🎵</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-white/70 text-sm">{track.artist}</p>
                  </div>
                  <span className="text-white/50 text-sm">{track.plays}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-5 h-5 text-orange-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
