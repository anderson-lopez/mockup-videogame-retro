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

  // Game state
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [showGame, setShowGame] = useState(false)
  const [activePlayers, setActivePlayers] = useState<number[]>([])

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

  const startGame = () => {
    if (selectedCharacter !== null && selectedTrack !== null) {
      setShowGame(true)
    }
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
          if (showGame) {
            setShowGame(false)
          } else {
            setShowMenu(true)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showMenu, selectedMenuItem, showGame])

  // Focus the selected menu item when it changes
  useEffect(() => {
    if (menuRef.current && menuRef.current.children[selectedMenuItem]) {
      ;(menuRef.current.children[selectedMenuItem] as HTMLElement).focus()
    }
  }, [selectedMenuItem])

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="text-white font-bold text-2xl md:text-4xl mb-8 tracking-widest pixelated">LOADING...</div>
        <div className="w-48 md:w-64 h-6 border-2 border-gray-500 relative">
          <div className="h-full bg-red-600" style={{ width: `${loadingProgress}%` }}></div>
        </div>
        <div className="text-white mt-2">{loadingProgress}%</div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case "start_game":
        if (showGame) {
          return <SnakeGame players={activePlayers} onExit={() => setShowGame(false)} />
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[calc(100%-60px)] overflow-y-auto">
            <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-3 md:p-4 flex flex-col">
              <h3 className="pixelated text-yellow-400 text-base md:text-lg mb-2 md:mb-3">CHARACTER SELECT</h3>
              <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4">
                {[1, 2, 3, 4].map((i) => {
                  const isActive = activePlayers.includes(i)
                  return (
                    <div
                      key={i}
                      className={`bg-gray-900 border-2 ${
                        isActive ? "border-yellow-400 bg-gray-800" : "border-gray-700"
                      } rounded flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-gray-800 transition-colors duration-200 relative group`}
                      onClick={() => {
                        setSelectedCharacter(i)
                        if (isActive) {
                          setActivePlayers(activePlayers.filter((p) => p !== i))
                        } else {
                          setActivePlayers([...activePlayers, i])
                        }
                      }}
                    >
                      <div
                        className={`w-12 h-12 md:w-16 md:h-16 ${
                          isActive ? getPlayerColor(i) : "bg-gray-700"
                        } rounded-full flex items-center justify-center text-white pixelated group-hover:bg-gray-600`}
                      >
                        P{i}
                      </div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isActive ? "Selected" : "Click to select"}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-3 md:p-4 flex flex-col">
              <h3 className="pixelated text-yellow-400 text-base md:text-lg mb-2 md:mb-3">TRACK SELECT</h3>
              <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4">
                {["CITY", "FOREST", "DESERT", "SNOW"].map((track, i) => (
                  <div
                    key={i}
                    className={`bg-gray-900 border-2 ${
                      selectedTrack === track ? "border-yellow-400 bg-gray-800" : "border-gray-700"
                    } rounded flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-gray-800 transition-colors duration-200 relative group`}
                    onClick={() => setSelectedTrack(track)}
                  >
                    <div
                      className={`text-white pixelated text-center text-sm md:text-base ${
                        selectedTrack === track ? "text-yellow-400" : ""
                      } group-hover:text-yellow-400`}
                    >
                      {track}
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {selectedTrack === track ? "Selected" : "Click to select"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                onClick={startGame}
                disabled={activePlayers.length === 0 || selectedTrack === null}
                className={`pixelated px-6 py-3 text-lg ${
                  activePlayers.length > 0 && selectedTrack !== null
                    ? "bg-yellow-600 text-black hover:bg-yellow-500"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                } border-2 border-gray-600 rounded`}
              >
                START SNAKE GAME
              </button>
            </div>
          </div>
        )
      case "options":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 md:p-6 h-[calc(100%-60px)] overflow-y-auto">
            <h3 className="pixelated text-yellow-400 text-lg md:text-xl mb-4 md:mb-6">OPTIONS</h3>

            <div className="grid gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white mb-2 md:mb-0">DIFFICULTY</div>
                <div className="flex gap-2 md:gap-4">
                  {["EASY", "NORMAL", "HARD"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-2 md:px-3 py-1 cursor-pointer text-sm md:text-base ${i === 1 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white mb-2 md:mb-0">SOUND</div>
                <div className="flex items-center gap-2">
                  <div className="pixelated text-gray-400 text-sm">LOW</div>
                  <div className="w-32 md:w-48 h-4 bg-gray-900 relative">
                    <div className="absolute h-full bg-yellow-600" style={{ width: "70%" }}></div>
                    <div
                      className="absolute h-6 md:h-8 w-2 md:w-3 bg-white border-2 border-gray-900 top-1/2 transform -translate-y-1/2"
                      style={{ left: "70%" }}
                    ></div>
                  </div>
                  <div className="pixelated text-gray-400 text-sm">HIGH</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white mb-2 md:mb-0">MUSIC</div>
                <div className="flex items-center gap-2">
                  <div className="pixelated text-gray-400 text-sm">LOW</div>
                  <div className="w-32 md:w-48 h-4 bg-gray-900 relative">
                    <div className="absolute h-full bg-yellow-600" style={{ width: "50%" }}></div>
                    <div
                      className="absolute h-6 md:h-8 w-2 md:w-3 bg-white border-2 border-gray-900 top-1/2 transform -translate-y-1/2"
                      style={{ left: "50%" }}
                    ></div>
                  </div>
                  <div className="pixelated text-gray-400 text-sm">HIGH</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4">
                <div className="pixelated text-white mb-2 md:mb-0">VIBRATION</div>
                <div className="flex gap-2 md:gap-4">
                  {["ON", "OFF"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-2 md:px-3 py-1 cursor-pointer text-sm md:text-base ${i === 0 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="pixelated text-white mb-2 md:mb-0">DISPLAY MODE</div>
                <div className="flex gap-2 md:gap-4">
                  {["4:3", "16:9"].map((option, i) => (
                    <div
                      key={i}
                      className={`pixelated px-2 md:px-3 py-1 cursor-pointer text-sm md:text-base ${i === 1 ? "bg-yellow-600 text-black" : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"}`}
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
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 md:p-6 h-[calc(100%-60px)] overflow-y-auto">
            <h3 className="pixelated text-yellow-400 text-lg md:text-xl mb-4 md:mb-6">GALLERY</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 md:p-6 h-[calc(100%-60px)] overflow-x-auto">
            <h3 className="pixelated text-yellow-400 text-lg md:text-xl mb-4 md:mb-6">HIGH SCORES</h3>

            <div className="grid gap-2 md:gap-4 min-w-[300px]">
              <div className="flex justify-between pixelated text-white border-b-2 border-gray-700 pb-2">
                <div className="w-8 md:w-12 text-center">#</div>
                <div className="flex-1">NAME</div>
                <div className="w-16 md:w-24 text-right">SCORE</div>
                <div className="w-16 md:w-24 text-right">TIME</div>
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
                  className={`flex justify-between pixelated text-sm md:text-base ${i === 0 ? "text-yellow-400" : "text-gray-400"} border-b border-gray-700 pb-2`}
                >
                  <div className="w-8 md:w-12 text-center">{i + 1}</div>
                  <div className="flex-1">{score.name}</div>
                  <div className="w-16 md:w-24 text-right">{score.score.toLocaleString()}</div>
                  <div className="w-16 md:w-24 text-right">{score.time}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case "credits":
        return (
          <div className="bg-gray-800/50 rounded border-2 border-gray-700 p-4 md:p-6 h-[calc(100%-60px)] overflow-auto">
            <h3 className="pixelated text-yellow-400 text-lg md:text-xl mb-4 md:mb-6">CREDITS</h3>

            <div className="grid gap-6 md:gap-8">
              <div>
                <h4 className="pixelated text-white text-base md:text-lg mb-2">GAME DIRECTOR</h4>
                <div className="pixelated text-gray-400 text-sm md:text-base">JOHN POLYGON</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-base md:text-lg mb-2">LEAD PROGRAMMER</h4>
                <div className="pixelated text-gray-400 text-sm md:text-base">JANE PIXEL</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-base md:text-lg mb-2">GRAPHICS TEAM</h4>
                <div className="pixelated text-gray-400 text-sm md:text-base">ALEX TEXTURE</div>
                <div className="pixelated text-gray-400 text-sm md:text-base">SAM SHADER</div>
                <div className="pixelated text-gray-400 text-sm md:text-base">PAT POLYGON</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-base md:text-lg mb-2">SOUND DESIGN</h4>
                <div className="pixelated text-gray-400 text-sm md:text-base">MIKE MIDI</div>
                <div className="pixelated text-gray-400 text-sm md:text-base">LISA LOOP</div>
              </div>

              <div>
                <h4 className="pixelated text-white text-base md:text-lg mb-2">SPECIAL THANKS</h4>
                <div className="pixelated text-gray-400 text-sm md:text-base">COFFEE MACHINE</div>
                <div className="pixelated text-gray-400 text-sm md:text-base">PIZZA DELIVERY</div>
                <div className="pixelated text-gray-400 text-sm md:text-base">MOM & DAD</div>
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
      <header className="relative z-10 pt-3 md:pt-6 px-4 md:px-8">
        <div className="pixelated text-white text-2xl md:text-4xl font-bold tracking-wider text-center mb-2 md:mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          RETRO REALM
        </div>
        <div className="pixelated text-yellow-400 text-xs md:text-sm text-center mb-4 md:mb-8">
          © 1998 POLYGON STUDIOS
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex h-[calc(100vh-150px)] md:h-[calc(100vh-200px)]">
        {showMenu ? (
          <div className="w-full flex flex-col items-center justify-center">
            <motion.div
              className="bg-black/70 p-4 md:p-6 md:pt-2 rounded-lg border-4 border-gray-700 w-64 md:w-80"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="pixelated text-white text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">MAIN MENU</h2>

              <ul ref={menuRef} className="space-y-3 md:space-y-4">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    tabIndex={0}
                    className={`pixelated text-lg md:text-xl font-bold flex items-center relative cursor-pointer transition-colors duration-200 ${
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
                        <ChevronRight className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                      </motion.div>
                    )}
                    <div className="flex items-center">
                      <span className="hidden md:inline-block">{item.icon}</span>
                      <span className={selectedMenuItem === index ? "ml-0" : ""}>{item.name}</span>
                    </div>
                    {selectedMenuItem === index && (
                      <div className="absolute right-0 top-0 bottom-0 flex items-center">
                        <div className="pixelated text-[10px] md:text-xs text-gray-500 opacity-70 hidden md:block">
                          CLICK/ENTER
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : (
          <div className="w-full px-2 md:px-8">
            <motion.div
              className="bg-black/70 p-3 md:p-6 md:pt-2 rounded-lg border-2 md:border-4 border-gray-700 h-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3 md:mb-1">
                <div className="w-24 md:w-32">
                  {showGame && (
                    <button
                      onClick={() => setShowGame(false)}
                      className="bg-gray-800 text-white p-1 md:p-2 rounded border-2 border-gray-600 hover:bg-gray-700 flex items-center"
                    >
                      <span className="pixelated text-xs md:text-sm">BACK</span>
                    </button>
                  )}
                </div>

                <h2 className="pixelated text-white text-lg md:text-2xl font-bold flex items-center">
                  {showGame ? (
                    "SNAKE GAME"
                  ) : (
                    <>
                      <span className="hidden md:inline-block">
                        {menuItems.find((item) => item.name.toLowerCase().replace(/\s+/g, "_") === currentView)?.icon}
                      </span>
                      {menuItems.find((item) => item.name.toLowerCase().replace(/\s+/g, "_") === currentView)?.name}
                    </>
                  )}
                </h2>

                <div className="w-24 md:w-32 flex justify-end">
                  <button
                    onClick={() => setShowMenu(true)}
                    className="bg-gray-800 text-white p-1 md:p-2 rounded border-2 border-gray-600 hover:bg-gray-700 flex items-center relative group"
                  >
                    <Menu className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    <span className="pixelated text-xs md:text-sm">MENU</span>
                    <div className="absolute -bottom-8 right-0 bg-black/80 px-2 py-1 rounded text-[10px] md:text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ESC key
                    </div>
                  </button>
                </div>
              </div>

              {renderView()}
            </motion.div>
          </div>
        )}
      </main>

      {/* HUD elements */}
      <footer className="absolute bottom-0 w-full px-3 md:px-6 py-2 md:py-3 bg-black/80 border-t-2 border-gray-700 flex justify-between items-center group">
        <div className="text-white pixelated text-xs md:text-sm">MEMORY CARD 1</div>
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full mr-1 md:mr-2"></div>
          <div className="text-white pixelated text-xs md:text-sm">REC</div>
        </div>
        <div className="text-white pixelated text-xs md:text-sm">V 1.0</div>

        <div className="absolute -top-20 md:-top-24 left-1/2 transform -translate-x-1/2 bg-black/90 p-2 md:p-3 rounded border border-gray-700 text-[10px] md:text-xs text-white pixelated opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 md:gap-4">
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

// Helper function to get player color
function getPlayerColor(playerIndex: number): string {
  const colors = [
    "bg-red-500", // Player 1 - Red
    "bg-blue-500", // Player 2 - Blue
    "bg-green-500", // Player 3 - Green
    "bg-yellow-500", // Player 4 - Yellow
  ]
  return colors[playerIndex - 1] || "bg-gray-500"
}

// Snake Game Component
function SnakeGame({ players, onExit }: { players: number[]; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<{
    snakes: {
      positions: { x: number; y: number }[]
      direction: string
      color: string
      score: number
      alive: boolean
    }[]
    food: { x: number; y: number; type: string }
    gameOver: boolean
    winner: number | null
  }>({
    snakes: [],
    food: { x: 0, y: 0, type: "apple" },
    gameOver: false,
    winner: null,
  })

  const [gameStarted, setGameStarted] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const gridSize = 20
  const cellSize = 15
  const gameSpeed = useRef(150)
  const gameLoopRef = useRef<number | null>(null)
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = gridSize * cellSize * 2
    canvas.height = gridSize * cellSize * 2

    // Initialize snakes
    const initialSnakes = players.map((player, index) => {
      // Position snakes in different corners
      let startX, startY
      switch (index) {
        case 0: // Top left
          startX = Math.floor(gridSize / 4)
          startY = Math.floor(gridSize / 4)
          break
        case 1: // Top right
          startX = Math.floor((gridSize * 3) / 4)
          startY = Math.floor(gridSize / 4)
          break
        case 2: // Bottom left
          startX = Math.floor(gridSize / 4)
          startY = Math.floor((gridSize * 3) / 4)
          break
        case 3: // Bottom right
          startX = Math.floor((gridSize * 3) / 4)
          startY = Math.floor((gridSize * 3) / 4)
          break
        default:
          startX = Math.floor(gridSize / 2)
          startY = Math.floor(gridSize / 2)
      }

      return {
        positions: [
          { x: startX, y: startY },
          { x: startX - 1, y: startY },
          { x: startX - 2, y: startY },
        ],
        direction: "right",
        color: getPlayerColor(player).replace("bg-", "text-"),
        score: 0,
        alive: true,
      }
    })

    // Generate initial food
    const food = generateFood(initialSnakes)

    setGameState({
      snakes: initialSnakes,
      food,
      gameOver: false,
      winner: null,
    })

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setGameStarted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [players])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameState.gameOver) return

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    let lastTime = 0
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTime > gameSpeed.current) {
        lastTime = timestamp
        updateGame()
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameStarted, gameState.gameOver])

  // Draw game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= gridSize * 2; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }

    // Draw food
    const { food } = gameState
    ctx.fillStyle = "#f00"
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize)

    // Draw snakes
    gameState.snakes.forEach((snake) => {
      if (!snake.alive) return

      // Get color from Tailwind class
      let color
      switch (snake.color) {
        case "text-red-500":
          color = "#ef4444"
          break
        case "text-blue-500":
          color = "#3b82f6"
          break
        case "text-green-500":
          color = "#22c55e"
          break
        case "text-yellow-500":
          color = "#eab308"
          break
        default:
          color = "#6b7280"
      }

      // Draw snake body
      snake.positions.forEach((pos, i) => {
        ctx.fillStyle = i === 0 ? color : `${color}aa`
        ctx.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize)

        // Draw eyes on head
        if (i === 0) {
          ctx.fillStyle = "#000"
          const eyeSize = cellSize / 4

          // Position eyes based on direction
          let leftEyeX, leftEyeY, rightEyeX, rightEyeY

          switch (snake.direction) {
            case "up":
              leftEyeX = pos.x * cellSize + eyeSize
              leftEyeY = pos.y * cellSize + eyeSize
              rightEyeX = pos.x * cellSize + cellSize - eyeSize * 2
              rightEyeY = pos.y * cellSize + eyeSize
              break
            case "down":
              leftEyeX = pos.x * cellSize + eyeSize
              leftEyeY = pos.y * cellSize + cellSize - eyeSize * 2
              rightEyeX = pos.x * cellSize + cellSize - eyeSize * 2
              rightEyeY = pos.y * cellSize + cellSize - eyeSize * 2
              break
            case "left":
              leftEyeX = pos.x * cellSize + eyeSize
              leftEyeY = pos.y * cellSize + eyeSize
              rightEyeX = pos.x * cellSize + eyeSize
              rightEyeY = pos.y * cellSize + cellSize - eyeSize * 2
              break
            case "right":
              leftEyeX = pos.x * cellSize + cellSize - eyeSize * 2
              leftEyeY = pos.y * cellSize + eyeSize
              rightEyeX = pos.x * cellSize + cellSize - eyeSize * 2
              rightEyeY = pos.y * cellSize + cellSize - eyeSize * 2
              break
            default:
              leftEyeX = pos.x * cellSize + eyeSize
              leftEyeY = pos.y * cellSize + eyeSize
              rightEyeX = pos.x * cellSize + cellSize - eyeSize * 2
              rightEyeY = pos.y * cellSize + eyeSize
          }

          ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize)
          ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize)
        }
      })
    })

    // Draw countdown or game over
    if (!gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '48px "Pixelated", monospace'
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.fillText(`${countdown}`, canvas.width / 2, canvas.height / 2)
    } else if (gameState.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '32px "Pixelated", monospace'
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"

      if (gameState.winner !== null) {
        ctx.fillText(`PLAYER ${gameState.winner} WINS!`, canvas.width / 2, canvas.height / 2 - 20)
      } else {
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20)
      }

      ctx.font = '16px "Pixelated", monospace'
      ctx.fillText("Press ESC to return to menu", canvas.width / 2, canvas.height / 2 + 20)
    }
  }, [gameState, gameStarted, countdown])

  // Update game state
  const updateGame = () => {
    setGameState((prevState) => {
      // Check if game is over
      if (prevState.gameOver) return prevState

      // Check if there's a winner
      const aliveSnakes = prevState.snakes.filter((snake) => snake.alive)
      if (aliveSnakes.length === 0) {
        return { ...prevState, gameOver: true }
      }

      const winningSnake = prevState.snakes.find((snake) => snake.score >= 30)
      if (winningSnake) {
        const winnerIndex = prevState.snakes.indexOf(winningSnake)
        return {
          ...prevState,
          gameOver: true,
          winner: players[winnerIndex],
        }
      }

      // Update snake directions based on key presses
      const updatedSnakes = prevState.snakes.map((snake, index) => {
        if (!snake.alive) return snake

        let newDirection = snake.direction

        // Player 1: WASD
        if (index === 0) {
          if (keysPressed.current["w"] && snake.direction !== "down") newDirection = "up"
          if (keysPressed.current["s"] && snake.direction !== "up") newDirection = "down"
          if (keysPressed.current["a"] && snake.direction !== "right") newDirection = "left"
          if (keysPressed.current["d"] && snake.direction !== "left") newDirection = "right"
        }

        // Player 2: IJKL
        if (index === 1) {
          if (keysPressed.current["i"] && snake.direction !== "down") newDirection = "up"
          if (keysPressed.current["k"] && snake.direction !== "up") newDirection = "down"
          if (keysPressed.current["j"] && snake.direction !== "right") newDirection = "left"
          if (keysPressed.current["l"] && snake.direction !== "left") newDirection = "right"
        }

        // Player 3: Arrow keys
        if (index === 2) {
          if (keysPressed.current["arrowup"] && snake.direction !== "down") newDirection = "up"
          if (keysPressed.current["arrowdown"] && snake.direction !== "up") newDirection = "down"
          if (keysPressed.current["arrowleft"] && snake.direction !== "right") newDirection = "left"
          if (keysPressed.current["arrowright"] && snake.direction !== "left") newDirection = "right"
        }

        // Player 4: Numpad 8, 4, 6, 2
        if (index === 3) {
          if (keysPressed.current["8"] && snake.direction !== "down") newDirection = "up"
          if (keysPressed.current["2"] && snake.direction !== "up") newDirection = "down"
          if (keysPressed.current["4"] && snake.direction !== "right") newDirection = "left"
          if (keysPressed.current["6"] && snake.direction !== "left") newDirection = "right"
        }

        return { ...snake, direction: newDirection }
      })

      // Move snakes
      const newSnakes = updatedSnakes.map((snake) => {
        if (!snake.alive) return snake

        const head = { ...snake.positions[0] }

        // Move head based on direction
        switch (snake.direction) {
          case "up":
            head.y -= 1
            break
          case "down":
            head.y += 1
            break
          case "left":
            head.x -= 1
            break
          case "right":
            head.x += 1
            break
        }

        // Check wall collision
        if (head.x < 0 || head.x >= gridSize * 2 || head.y < 0 || head.y >= gridSize * 2) {
          return { ...snake, alive: false }
        }

        // Check self collision
        if (snake.positions.some((pos) => pos.x === head.x && pos.y === head.y)) {
          return { ...snake, alive: false }
        }

        // Check collision with other snakes
        for (const otherSnake of updatedSnakes) {
          if (otherSnake === snake || !otherSnake.alive) continue

          if (otherSnake.positions.some((pos) => pos.x === head.x && pos.y === head.y)) {
            return { ...snake, alive: false }
          }
        }

        // Check food collision
        let newScore = snake.score
        let ateFood = false

        if (head.x === prevState.food.x && head.y === prevState.food.y) {
          newScore += 1
          ateFood = true
        }

        // Create new positions array
        const newPositions = [head, ...snake.positions]
        if (!ateFood) newPositions.pop()

        return {
          ...snake,
          positions: newPositions,
          score: newScore,
        }
      })

      // Check if any snake ate food
      const foodEaten = newSnakes.some(
        (snake) =>
          snake.alive && snake.positions[0].x === prevState.food.x && snake.positions[0].y === prevState.food.y,
      )

      // Generate new food if eaten
      let newFood = prevState.food
      if (foodEaten) {
        newFood = generateFood(newSnakes)
      }

      return {
        ...prevState,
        snakes: newSnakes,
        food: newFood,
      }
    })
  }

  // Generate food at random position
  const generateFood = (snakes: any[]) => {
    let x, y
    let validPosition = false

    while (!validPosition) {
      x = Math.floor(Math.random() * gridSize * 2)
      y = Math.floor(Math.random() * gridSize * 2)

      validPosition = true

      // Check if food spawns on any snake
      for (const snake of snakes) {
        if (!snake.alive) continue

        if (snake.positions.some((pos: { x: number; y: number }) => pos.x === x && pos.y === y)) {
          validPosition = false
          break
        }
      }
    }

    return { x, y, type: "apple" }
  }

  // Handle exit game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onExit])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border-4 border-gray-700 bg-gray-900"
            style={{ imageRendering: "pixelated" }}
          ></canvas>

          <div className="absolute top-2 left-2 grid grid-cols-2 gap-2">
            {gameState.snakes.map((snake, i) => (
              <div
                key={i}
                className={`pixelated text-xs ${snake.color} ${!snake.alive ? "line-through opacity-50" : ""}`}
              >
                P{players[i]}: {snake.score}/30 {!snake.alive ? "(DEAD)" : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <div className="pixelated text-xs text-white bg-gray-800/50 p-2 rounded">
            <span className="text-red-500">P1:</span> WASD
          </div>
          <div className="pixelated text-xs text-white bg-gray-800/50 p-2 rounded">
            <span className="text-blue-500">P2:</span> IJKL
          </div>
          <div className="pixelated text-xs text-white bg-gray-800/50 p-2 rounded">
            <span className="text-green-500">P3:</span> ↑↓←→
          </div>
          <div className="pixelated text-xs text-white bg-gray-800/50 p-2 rounded">
            <span className="text-yellow-500">P4:</span> 8246
          </div>
        </div>
      </div>
    </div>
  )
}
