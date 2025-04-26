'use client'
import { useEffect, useRef, useState } from "react"
import { ChevronRight, Gamepad2, ImageIcon, Menu, Settings, Trophy, Users } from "lucide-react"
import { motion } from "framer-motion"


export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(0)
  const [showMenu, setShowMenu] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("menu")
  const menuRef = useRef<HTMLUListElement>(null)

  const menuItems = [
    { name: "START GAME", icon: <Gamepad2 className="h-5 w-5 mr-2" /> },
    { name: "OPTIONS", icon: <Settings className="h-5 w-5 mr-2" /> },
    { name: "GALLERY", icon: <ImageIcon className="h-5 w-5 mr-2" /> },
    { name: "HIGH SCORES", icon: <Trophy className="h-5 w-5 mr-2" /> },
    { name: "CREDITS", icon: <Users className="h-5 w-5 mr-2" /> },
  ]

  useEffect(() => {
    // Simulate loading screen
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const handleMenuNavigation = (direction: "up" | "down") => {
    if (direction === "up") {
      setSelectedMenuItem((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))
    } else {
      setSelectedMenuItem((prev) => (prev === menuItems.length - 1 ? 0 : prev + 1))
    }
  }

  const handleMenuSelect = () => {
    setShowMenu(false)
    setCurrentView(menuItems[selectedMenuItem].name.toLowerCase().replace(/\s+/g, "_"))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showMenu) {
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
          handleMenuNavigation("up")
        } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
          handleMenuNavigation("down")
        } else if (e.key === "Enter" || e.key === "x" || e.key === "X") {
          handleMenuSelect()
        }
      } else {
        if (e.key === "Escape" || e.key === "m" || e.key === "M") {
          setShowMenu(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showMenu, selectedMenuItem])

  // Focus the selected menu item when it changes
  useEffect(() => {
    if (menuRef.current && menuRef.current.children[selectedMenuItem]) {
      ;(menuRef.current.children[selectedMenuItem] as HTMLElement).focus()
    }
  }, [selectedMenuItem])

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="text-white font-bold text-4xl mb-8 tracking-widest pixelated">LOADING...</div>
        <div className="w-64 h-6 border-2 border-gray-500 relative">
          <div className="h-full bg-red-600" style={{ width: `${loadingProgress}%` }}></div>
        </div>
        <div className="text-white mt-2">{loadingProgress}%</div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case "start_game":
        return (
          <div className="grid grid-cols-2 gap-6 h-[calc(100%-60px)]">
            <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 flex flex-col">
              <h3 className="pixelated text-yellow-400 text-lg mb-3">CHARACTER SELECT</h3>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border-2 border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-gray-800 transition-colors duration-200 relative group"
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white pixelated group-hover:bg-gray-600">
                      P{i}
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to select
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 flex flex-col">
              <h3 className="pixelated text-yellow-400 text-lg mb-3">TRACK SELECT</h3>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {["CITY", "FOREST", "DESERT", "SNOW"].map((track, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border-2 border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-gray-800 transition-colors duration-200 relative group"
                  >
                    <div className="text-white pixelated text-center group-hover:text-yellow-400">{track}</div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to select
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "options":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-6 h-[calc(100%-60px)]">
            <h3 className="pixelated text-yellow-400 text-xl mb-6">OPTIONS</h3>

            <div className="grid gap-6">
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white">DIFFICULTY</div>
                <div className="flex gap-4">
                  {["EASY", "NORMAL", "HARD"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-3 py-1 cursor-pointer ${i === 1 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white">SOUND</div>
                <div className="flex items-center gap-2">
                  <div className="pixelated text-gray-400">LOW</div>
                  <div className="w-48 h-4 bg-gray-900 relative">
                    <div className="absolute h-full bg-yellow-600" style={{ width: "70%" }}></div>
                    <div
                      className="absolute h-8 w-3 bg-white border-2 border-gray-900 top-1/2 transform -translate-y-1/2"
                      style={{ left: "70%" }}
                    ></div>
                  </div>
                  <div className="pixelated text-gray-400">HIGH</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white">MUSIC</div>
                <div className="flex items-center gap-2">
                  <div className="pixelated text-gray-400">LOW</div>
                  <div className="w-48 h-4 bg-gray-900 relative">
                    <div className="absolute h-full bg-yellow-600" style={{ width: "50%" }}></div>
                    <div
                      className="absolute h-8 w-3 bg-white border-2 border-gray-900 top-1/2 transform -translate-y-1/2"
                      style={{ left: "50%" }}
                    ></div>
                  </div>
                  <div className="pixelated text-gray-400">HIGH</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white">VIBRATION</div>
                <div className="flex gap-4">
                  {["ON", "OFF"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-3 py-1 cursor-pointer ${i === 0 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="pixelated text-white">DISPLAY MODE</div>
                <div className="flex gap-4">
                  {["4:3", "16:9"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-3 py-1 cursor-pointer ${i === 1 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case "gallery":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-6 h-[calc(100%-60px)] overflow-y-auto">
            <h3 className="pixelated text-yellow-400 text-xl mb-6">GALLERY</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group cursor-pointer">
                  <div className="bg-gray-900 border-2 border-gray-700 aspect-video flex items-center justify-center hover:border-yellow-400">
                    <div className="pixelated text-gray-500">IMAGE {i}</div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 px-2 py-1 pixelated text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Screenshot {i} - Level {i}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 pb-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center pixelated ${i === 1 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"} cursor-pointer`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        )
      case "high_scores":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-6 h-[calc(100%-60px)]">
            <h3 className="pixelated text-yellow-400 text-xl mb-6">HIGH SCORES</h3>

            <div className="grid gap-4">
              <div className="flex justify-between pixelated text-white border-b-2 border-gray-700 pb-2">
                <div className="w-12 text-center">#</div>
                <div className="flex-1">NAME</div>
                <div className="w-24 text-right">SCORE</div>
                <div className="w-24 text-right">TIME</div>
              </div>

              {[
                { name: "AAA", score: 999999, time: "01:23:45" },
                { name: "BBB", score: 888888, time: "01:25:12" },
                { name: "CCC", score: 777777, time: "01:30:34" },
                { name: "DDD", score: 666666, time: "01:32:56" },
                { name: "EEE", score: 555555, time: "01:35:21" },
              ].map((score, i) => (
                <div
                  key={i}
                  className={`flex justify-between pixelated ${i === 0 ? "text-yellow-400" : "text-gray-400"} border-b border-gray-700 pb-2`}
                >
                  <div className="w-12 text-center">{i + 1}</div>
                  <div className="flex-1">{score.name}</div>
                  <div className="w-24 text-right">{score.score.toLocaleString()}</div>
                  <div className="w-24 text-right">{score.time}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case "credits":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-6 h-[calc(100%-60px)] overflow-auto">
            <h3 className="pixelated text-yellow-400 text-xl mb-6">CREDITS</h3>

            <div className="grid gap-8">
              <div>
                <h4 className="pixelated text-white text-lg mb-2">GAME DIRECTOR</h4>
                <div className="pixelated text-gray-400">JOHN POLYGON</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-lg mb-2">LEAD PROGRAMMER</h4>
                <div className="pixelated text-gray-400">JANE PIXEL</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-lg mb-2">GRAPHICS TEAM</h4>
                <div className="pixelated text-gray-400">ALEX TEXTURE</div>
                <div className="pixelated text-gray-400">SAM SHADER</div>
                <div className="pixelated text-gray-400">PAT POLYGON</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-lg mb-2">SOUND DESIGN</h4>
                <div className="pixelated text-gray-400">MIKE MIDI</div>
                <div className="pixelated text-gray-400">LISA LOOP</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-lg mb-2">SPECIAL THANKS</h4>
                <div className="pixelated text-gray-400">COFFEE MACHINE</div>
                <div className="pixelated text-gray-400">PIZZA DELIVERY</div>
                <div className="pixelated text-gray-400">MOM & DAD</div>
              </div>

              <div className="text-center pixelated text-yellow-400 mt-4">© 1998 POLYGON STUDIOS</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-blue-900 to-purple-900">
      {/* Fog effect */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] opacity-20 mix-blend-overlay"></div>

      {/* Low-poly mountains in background */}
      <div className="absolute bottom-0 w-full h-64 bg-[url('/placeholder.svg?height=200&width=800')] bg-repeat-x opacity-40"></div>

      {/* PS1-style header */}
      <header className="relative z-10 pt-6 px-8">
        <div className="pixelated text-white text-4xl font-bold tracking-wider text-center mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          RETRO REALM
        </div>
        <div className="pixelated text-yellow-400 text-sm text-center mb-8">© 1998 POLYGON STUDIOS</div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex h-[calc(100vh-200px)]">
        {showMenu ? (
          <div className="w-full flex flex-col items-center justify-center">
            <motion.div
              className="bg-black/70 p-6 rounded-lg border-4 border-gray-700 w-80"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="pixelated text-white text-2xl font-bold mb-6 text-center">MAIN MENU</h2>

              <ul ref={menuRef} className="space-y-4">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    tabIndex={0}
                    className={`pixelated text-xl font-bold flex items-center relative cursor-pointer transition-colors duration-200 ${
                      selectedMenuItem === index ? "text-yellow-400" : "text-gray-400 hover:text-gray-200"
                    } focus:outline-none`}
                    onClick={() => {
                      setSelectedMenuItem(index)
                      setTimeout(() => handleMenuSelect(), 300)
                    }}
                    onMouseEnter={() => setSelectedMenuItem(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleMenuSelect()
                      }
                    }}
                  >
                    {selectedMenuItem === index && (
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                      >
                        <ChevronRight className="mr-2 h-5 w-5" />
                      </motion.div>
                    )}
                    <div className="flex items-center">
                      {item.icon}
                      <span className={selectedMenuItem === index ? "ml-0" : ""}>{item.name}</span>
                    </div>
                    {selectedMenuItem === index && (
                      <div className="absolute right-0 top-0 bottom-0 flex items-center">
                        <div className="pixelated text-xs text-gray-500 opacity-70">CLICK/ENTER</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : (
          <div className="w-full px-8">
            <motion.div
              className="bg-black/70 p-6 rounded-lg border-4 border-gray-700 h-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="pixelated text-white text-2xl font-bold flex items-center">
                  {menuItems.find((item) => item.name.toLowerCase().replace(/\s+/g, "_") === currentView)?.icon}
                  {menuItems.find((item) => item.name.toLowerCase().replace(/\s+/g, "_") === currentView)?.name}
                </h2>
                <button
                  onClick={() => setShowMenu(true)}
                  className="bg-gray-800 text-white p-2 rounded border-2 border-gray-600 hover:bg-gray-700 flex items-center relative group"
                >
                  <Menu className="h-5 w-5 mr-1" />
                  <span className="pixelated text-sm">MENU</span>
                  <div className="absolute -bottom-8 right-0 bg-black/80 px-2 py-1 rounded text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ESC key
                  </div>
                </button>
              </div>

              {renderView()}
            </motion.div>
          </div>
        )}
      </main>

      {/* HUD elements */}
      <footer className="absolute bottom-0 w-full px-6 py-3 bg-black/80 border-t-2 border-gray-700 flex justify-between items-center group">
        <div className="text-white pixelated text-sm">MEMORY CARD 1</div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
          <div className="text-white pixelated text-sm">REC</div>
        </div>
        <div className="text-white pixelated text-sm">V 1.0</div>

        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-black/90 p-3 rounded border border-gray-700 text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-4">
          <div className="flex flex-col items-center">
            <div className="text-yellow-400">↑↓</div>
            <div>Navigate</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-400">ENTER</div>
            <div>Select</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-400">ESC</div>
            <div>Menu</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
