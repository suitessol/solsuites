"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  SquareStackIcon as StairsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CoinsIcon,
  UserIcon,
  TrendingUpIcon,
  BuildingIcon,
  PercentIcon,
} from "lucide-react"

// Define suite information with floor ranges
const suites = [
  { id: 1, name: "Penthouse", floors: [25], priceMultiplier: 16 },
  { id: 2, name: "Floor 24", floors: [24], priceMultiplier: 11 },
  { id: 3, name: "Floor 22-23", floors: [22, 23], priceMultiplier: 9 },
  { id: 4, name: "Floor 20-21", floors: [20, 21], priceMultiplier: 7 },
  { id: 5, name: "Floor 18-19", floors: [18, 19], priceMultiplier: 6 },
  { id: 6, name: "Floor 16-17", floors: [16, 17], priceMultiplier: 5 },
  { id: 7, name: "Floor 10-15", floors: [10, 11, 12, 13, 14, 15], priceMultiplier: 3 },
  { id: 8, name: "Floor 8-9", floors: [8, 9], priceMultiplier: 2 },
  { id: 9, name: "Floor 1-7", floors: [1, 2, 3, 4, 5, 6, 7], priceMultiplier: 1 },
]

// Define custom positions for each image to create perfect stacking
const imagePositions = {
  1: 650, // Penthouse (top floor) - moved up
  2: 520, // Floor 24 - moved up
  3: 390, // Floor 22-23 - moved up
  4: 260, // Floor 20-21 - moved up
  5: 130, // Floor 18-19 - moved up
  6: 0, // Floor 16-17 - moved up
  7: -130, // Floor 10-15 - moved up
  8: -260, // Floor 8-9 - moved up
  9: -390, // Floor 1-7 (bottom floors) - moved up to be visible
}

// Define specific cloud configurations
const initialClouds = [
  {
    id: 1,
    x: 15, // left side
    y: 25, // top area
    size: 1.5, // large cloud
    speed: 0.002, // very slow movement
    image: "cloud1.png",
    zIndex: 1,
    direction: "right", // moving right
  },
  {
    id: 2,
    x: 70, // right side
    y: 60, // middle area
    size: 0.8, // small cloud
    speed: 0.001, // extremely slow movement
    image: "cloud2.png",
    zIndex: 2,
    direction: "left", // moving left
  },
]

// Define room types with different sizes, shapes, and rarity
const roomTypes = [
  {
    id: 1,
    name: "Studio",
    size: "Small",
    shape: "Rectangle",
    rarity: 0.4, // 40% chance (common)
    priceRange: [500, 1200],
    dimensions: { w: 2, h: 1 },
  },
  {
    id: 2,
    name: "Standard",
    size: "Medium",
    shape: "Square",
    rarity: 0.3, // 30% chance (common)
    priceRange: [1200, 1800],
    dimensions: { w: 2, h: 2 },
  },
  {
    id: 3,
    name: "L-Studio",
    size: "Medium",
    shape: "L-Shape",
    rarity: 0.1, // 10% chance (uncommon)
    priceRange: [1500, 2200],
    dimensions: { w: 3, h: 2, isL: true },
  },
  {
    id: 4,
    name: "Corner Suite",
    size: "Medium",
    shape: "Rectangle",
    rarity: 0.08, // 8% chance (uncommon)
    priceRange: [1800, 2500],
    dimensions: { w: 3, h: 1 },
  },
  {
    id: 5,
    name: "Deluxe",
    size: "Large",
    shape: "Rectangle",
    rarity: 0.05, // 5% chance (rare)
    priceRange: [2500, 3500],
    dimensions: { w: 3, h: 2 },
  },
  {
    id: 6,
    name: "L-Suite",
    size: "Large",
    shape: "L-Shape",
    rarity: 0.04, // 4% chance (rare)
    priceRange: [3000, 4000],
    dimensions: { w: 4, h: 3, isL: true },
  },
  {
    id: 7,
    name: "Executive",
    size: "X-Large",
    shape: "Rectangle",
    rarity: 0.02, // 2% chance (very rare)
    priceRange: [4000, 5500],
    dimensions: { w: 4, h: 2 },
  },
  {
    id: 8,
    name: "Presidential",
    size: "XX-Large",
    shape: "L-Shape",
    rarity: 0.01, // 1% chance (extremely rare)
    priceRange: [5500, 8000],
    dimensions: { w: 5, h: 3, isL: true },
  },
]

// Generate a random room type based on rarity
const getRandomRoomType = () => {
  const rand = Math.random()
  let cumulativeProbability = 0

  for (const type of roomTypes) {
    cumulativeProbability += type.rarity
    if (rand <= cumulativeProbability) {
      return type
    }
  }

  // Fallback to the first type if something goes wrong
  return roomTypes[0]
}

// Generate a random price within the range for a room type, adjusted by floor multiplier
const getRandomPrice = (roomType, floorMultiplier = 1) => {
  const [min, max] = roomType.priceRange
  const basePrice = Math.floor(Math.random() * (max - min + 1)) + min
  return Math.floor(basePrice * floorMultiplier)
}

// Generate a random owner address or "On Sale!" for available rooms
const getRandomOwner = (isAvailable) => {
  if (isAvailable) {
    return "On Sale!"
  }

  // Generate a random Ethereum-like address
  const chars = "0123456789abcdef"
  let address = "0x"
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }

  // Format as 0x1234...5678
  return `${address.substring(0, 6)}...${address.substring(38)}`
}

// Generate floor layouts with realistic room arrangements and L-shaped rooms
const generateFloorLayout = (floorNumber: number, suiteId: number) => {
  // Get the price multiplier for this floor
  const suite = suites.find((s) => s.id === suiteId) || suites[suites.length - 1]
  const priceMultiplier = suite.priceMultiplier

  // Create a grid-based layout system
  const grid = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))
  const layout = []

  // First, place fixed elements like elevators, stairs, and hallways

  // Add elevator
  layout.push({
    id: `${floorNumber}-elevator`,
    x: 0,
    y: 0,
    w: 1,
    h: 2,
    type: "elevator",
    isAvailable: false,
  })
  grid[0][0] = "elevator"
  grid[1][0] = "elevator"

  // Add stairs
  layout.push({
    id: `${floorNumber}-stairs`,
    x: 0,
    y: 2,
    w: 1,
    h: 2,
    type: "stairs",
    isAvailable: false,
  })
  grid[2][0] = "stairs"
  grid[3][0] = "stairs"

  // Add main hallway
  for (let x = 1; x < 8; x++) {
    layout.push({
      id: `${floorNumber}-hall-h-${x}`,
      x: x,
      y: 1,
      w: 1,
      h: 1,
      type: "hallway",
      isAvailable: false,
    })
    grid[1][x] = "hallway"
  }

  // Add vertical hallway
  for (let y = 2; y < 6; y++) {
    layout.push({
      id: `${floorNumber}-hall-v-${y}`,
      x: 4,
      y: y,
      w: 1,
      h: 1,
      type: "hallway",
      isAvailable: false,
    })
    grid[y][4] = "hallway"
  }

  // Now place rooms of different types
  let roomCount = 1

  // Try to place rooms until we have enough or run out of space
  const maxAttempts = 100
  let attempts = 0

  while (roomCount <= 12 && attempts < maxAttempts) {
    attempts++

    // Get a random room type
    const roomType = getRandomRoomType()
    const { w, h, isL } = roomType.dimensions

    // For L-shaped rooms, we need special handling
    if (isL) {
      // Find a valid position for an L-shaped room
      const validPositions = []

      for (let y = 0; y < 8 - h + 1; y++) {
        for (let x = 0; x < 8 - w + 1; x++) {
          // Check if this position and the L-shape extension are free
          let isValid = true

          // Check the main rectangle
          for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
              if (grid[y + dy] && grid[y + dy][x + dx] !== null) {
                isValid = false
                break
              }
            }
            if (!isValid) break
          }

          if (isValid) {
            // Check if the room would be adjacent to a hallway
            let adjacentToHallway = false

            // Check all cells of the potential room
            for (let dy = 0; dy < h; dy++) {
              for (let dx = 0; dx < w; dx++) {
                // Check all four directions for each cell
                const directions = [
                  { dx: -1, dy: 0 }, // left
                  { dx: 1, dy: 0 }, // right
                  { dx: 0, dy: -1 }, // up
                  { dx: 0, dy: 1 }, // down
                ]

                for (const dir of directions) {
                  const nx = x + dx + dir.dx
                  const ny = y + dy + dir.dy

                  if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && grid[ny] && grid[ny][nx] === "hallway") {
                    adjacentToHallway = true
                    break
                  }
                }

                if (adjacentToHallway) break
              }
              if (adjacentToHallway) break
            }

            if (adjacentToHallway) {
              validPositions.push({ x, y })
            }
          }
        }
      }

      if (validPositions.length > 0) {
        // Choose a random valid position
        const pos = validPositions[Math.floor(Math.random() * validPositions.length)]

        // Mark the grid as occupied
        for (let dy = 0; dy < h; dy++) {
          for (let dx = 0; dx < w; dx++) {
            if (grid[pos.y + dy]) {
              grid[pos.y + dy][pos.x + dx] = roomCount
            }
          }
        }

        // For L-shape, remove one corner (randomly choose which corner)
        const cornerOptions = [
          { x: pos.x, y: pos.y }, // Top-left
          { x: pos.x + w - 1, y: pos.y }, // Top-right
          { x: pos.x, y: pos.y + h - 1 }, // Bottom-left
          { x: pos.x + w - 1, y: pos.y + h - 1 }, // Bottom-right
        ]

        const cornerToRemove = cornerOptions[Math.floor(Math.random() * cornerOptions.length)]
        grid[cornerToRemove.y][cornerToRemove.x] = null

        // Find a cell adjacent to a hallway for the door
        let doorPosition = null

        // Check all cells of the room
        for (let dy = 0; dy < h && !doorPosition; dy++) {
          for (let dx = 0; dx < w && !doorPosition; dx++) {
            // Skip the removed corner
            if (pos.x + dx === cornerToRemove.x && pos.y + dy === cornerToRemove.y) {
              continue
            }

            // Only check cells at the edge of the room
            if (dx === 0 || dx === w - 1 || dy === 0 || dy === h - 1) {
              // Check all four directions
              const directions = [
                { dx: -1, dy: 0 }, // left
                { dx: 1, dy: 0 }, // right
                { dx: 0, dy: -1 }, // up
                { dx: 0, dy: 1 }, // down
              ]

              for (const dir of directions) {
                const nx = pos.x + dx + dir.dx
                const ny = pos.y + dy + dir.dy

                if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && grid[ny] && grid[ny][nx] === "hallway") {
                  doorPosition = { x: dx, y: dy, direction: { dx: dir.dx, dy: dir.dy } }
                  break
                }
              }
            }
          }
        }

        // Create the room
        const isAvailable = Math.random() > 0.3 // 70% chance of being available
        const price = getRandomPrice(roomType, priceMultiplier)
        const owner = getRandomOwner(isAvailable)

        layout.push({
          id: `${floorNumber}-${roomCount}`,
          x: pos.x,
          y: pos.y,
          w: w,
          h: h,
          type: "room",
          roomType: roomType,
          isAvailable,
          isLShaped: true,
          cornerRemoved: {
            x: cornerToRemove.x - pos.x,
            y: cornerToRemove.y - pos.y,
          },
          doorPosition: doorPosition,
          roomNumber: floorNumber * 100 + Math.floor(Math.random() * 99),
          price,
          location: `${floorNumber}.${Math.floor(Math.random() * 100)}`,
          owner,
        })

        roomCount++
      }
    } else {
      // Regular rectangular room
      // Find a valid position
      const validPositions = []

      for (let y = 0; y < 8 - h; y++) {
        for (let x = 0; x < 8 - w; x++) {
          // Check if this position is free
          let isValid = true

          for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
              if (grid[y + dy] && grid[y + dy][x + dx] !== null) {
                isValid = false
                break
              }
            }
            if (!isValid) break
          }

          if (isValid) {
            // Check if the room would be adjacent to a hallway
            let adjacentToHallway = false

            // Check all cells of the potential room
            for (let dy = 0; dy < h; dy++) {
              for (let dx = 0; dx < w; dx++) {
                // Only check cells at the edge of the room
                if (dx === 0 || dx === w - 1 || dy === 0 || dy === h - 1) {
                  // Check all four directions
                  const directions = [
                    { dx: -1, dy: 0 }, // left
                    { dx: 1, dy: 0 }, // right
                    { dx: 0, dy: -1 }, // up
                    { dx: 0, dy: 1 }, // down
                  ]

                  for (const dir of directions) {
                    const nx = x + dx + dir.dx
                    const ny = y + dy + dir.dy

                    if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && grid[ny] && grid[ny][nx] === "hallway") {
                      adjacentToHallway = true
                      break
                    }
                  }

                  if (adjacentToHallway) break
                }
              }
              if (adjacentToHallway) break
            }

            if (adjacentToHallway) {
              validPositions.push({ x, y })
            }
          }
        }
      }

      if (validPositions.length > 0) {
        // Choose a random valid position
        const pos = validPositions[Math.floor(Math.random() * validPositions.length)]

        // Mark the grid as occupied
        for (let dy = 0; dy < h; dy++) {
          for (let dx = 0; dx < w; dx++) {
            if (grid[pos.y + dy]) {
              grid[pos.y + dy][pos.x + dx] = roomCount
            }
          }
        }

        // Find a cell adjacent to a hallway for the door
        let doorPosition = null

        // Check all cells of the room
        for (let dy = 0; dy < h && !doorPosition; dy++) {
          for (let dx = 0; dx < w && !doorPosition; dx++) {
            // Only check cells at the edge of the room
            if (dx === 0 || dx === w - 1 || dy === 0 || dy === h - 1) {
              // Check all four directions
              const directions = [
                { dx: -1, dy: 0 }, // left
                { dx: 1, dy: 0 }, // right
                { dx: 0, dy: -1 }, // up
                { dx: 0, dy: 1 }, // down
              ]

              for (const dir of directions) {
                const nx = pos.x + dx + dir.dx
                const ny = pos.y + dy + dir.dy

                if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && grid[ny] && grid[ny][nx] === "hallway") {
                  doorPosition = { x: dx, y: dy, direction: { dx: dir.dx, dy: dir.dy } }
                  break
                }
              }
            }
          }
        }

        // Create the room
        const isAvailable = Math.random() > 0.3 // 70% chance of being available
        const price = getRandomPrice(roomType, priceMultiplier)
        const owner = getRandomOwner(isAvailable)

        layout.push({
          id: `${floorNumber}-${roomCount}`,
          x: pos.x,
          y: pos.y,
          w: w,
          h: h,
          type: "room",
          roomType: roomType,
          isAvailable,
          isLShaped: false,
          doorPosition: doorPosition,
          roomNumber: floorNumber * 100 + Math.floor(Math.random() * 99),
          price,
          location: `${floorNumber}.${Math.floor(Math.random() * 100)}`,
          owner,
        })

        roomCount++
      }
    }
  }

  return layout
}

// Custom elevator component with up and down arrows
const ElevatorIcon = () => (
  <div className="flex flex-col items-center justify-center space-y-1">
    <ArrowUpIcon className="h-3 w-3 text-[#4e8eca]" />
    <ArrowDownIcon className="h-3 w-3 text-[#4e8eca]" />
  </div>
)

// Helper function to get cell type style
const getCellTypeStyle = (cell: any) => {
  switch (cell.type) {
    case "elevator":
      return "bg-[#4e8eca] text-white"
    case "stairs":
      return "bg-[#a4c2e0] text-black"
    case "hallway":
      return "bg-[#2C4270] text-gray-300"
    case "room":
      return cell.isAvailable ? "bg-[#132B50] hover:bg-[#6A30C2]" : "bg-[#2C0E61] text-gray-400"
    default:
      return "bg-gray-500 text-white"
  }
}

// Helper function to get cell type content
const getCellTypeContent = (cell: any) => {
  if (cell.type === "elevator") {
    return <ElevatorIcon />
  } else if (cell.type === "stairs") {
    return <StairsIcon className="h-6 w-6 text-[#4e8eca]" />
  } else if (cell.type === "room") {
    if (cell.isAvailable) {
      return <span className="font-press-start text-xs">AVAILABLE</span>
    } else {
      return <span className="font-press-start text-xs">{cell.owner}</span>
    }
  }
  return null
}

export default function SuitesPage() {
  const [hoveredSuite, setHoveredSuite] = useState<number | null>(null)
  const [clouds, setClouds] = useState(initialClouds)
  const [isFloorSelectorOpen, setIsFloorSelectorOpen] = useState(false)
  const [isRoomLayoutOpen, setIsRoomLayoutOpen] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [floorLayout, setFloorLayout] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)

  // Wallet simulation
  const [walletBalance, setWalletBalance] = useState(1500)
  const [isWalletConnected, setIsWalletConnected] = useState(true) // Set to true by default
  const [simulationMode, setSimulationMode] = useState(true) // Add simulation mode state
  const [ownedProperties, setOwnedProperties] = useState<any[]>([])
  const [rentalIncome, setRentalIncome] = useState(0)
  const [totalRentalEarned, setTotalRentalEarned] = useState(0)
  const [isRealtorModalOpen, setIsRealtorModalOpen] = useState(false)
  const [purchaseTime, setPurchaseTime] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  // Add these near the other state variables
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false)
  const [sellPrice, setSellPrice] = useState(0)
  const [profitPercentage, setProfitPercentage] = useState(0)

  // Add these near the other state variables
  const [username, setUsername] = useState("PLAYER_1")
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)

  // Notification system
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: string }>>([])
  const [notificationCount, setNotificationCount] = useState(0)

  // Animation for wallet balance
  const [animatedBalance, setAnimatedBalance] = useState(walletBalance)
  const prevBalanceRef = useRef(walletBalance)

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animate wallet balance changes
  useEffect(() => {
    if (walletBalance !== prevBalanceRef.current) {
      // Animate the balance change
      const diff = walletBalance - prevBalanceRef.current
      let startValue = prevBalanceRef.current
      const duration = 1000 // ms
      const increment = diff / (duration / 16) // 60fps

      const animation = setInterval(() => {
        startValue += increment
        if ((increment > 0 && startValue >= walletBalance) || (increment < 0 && startValue <= walletBalance)) {
          clearInterval(animation)
          setAnimatedBalance(walletBalance)
        } else {
          setAnimatedBalance(Math.round(startValue))
        }
      }, 16)

      prevBalanceRef.current = walletBalance

      return () => clearInterval(animation)
    }
  }, [walletBalance])

  // Show in-browser notification
  const showNotification = useCallback(
    (message: string, type = "info") => {
      const id = notificationCount
      setNotificationCount((prev) => prev + 1)
      setNotifications((prev) => [...prev, { id, message, type }])

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
      }, 5000)
    },
    [notificationCount],
  )

  // Add this state for the earnings modal
  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState(false)
  const [earningsHistory, setEarningsHistory] = useState<Array<{ timestamp: number; amount: number }>>([])

  // Generate rental income
  useEffect(() => {
    if (ownedProperties.length > 0) {
      // Generate income every 15 seconds for demo purposes (instead of every minute)
      const rentalInterval = setInterval(() => {
        // Calculate rental income (4% of property value every 2-3 minutes)
        const totalRental = ownedProperties.reduce((total, property) => {
          // 4% of property value per 3 minutes = ~1.33% per minute
          // For demo: 1.33% / 4 = ~0.33% per 15 seconds
          const rentalPerInterval = Math.round(property.price * 0.0033)
          return total + rentalPerInterval
        }, 0)

        if (totalRental > 0) {
          setRentalIncome(totalRental * 4) // Show per minute rate in UI
          setWalletBalance((prev) => prev + totalRental)
          setTotalRentalEarned((prev) => prev + totalRental)

          // Add to earnings history
          setEarningsHistory((prev) => [
            ...prev,
            {
              timestamp: Date.now(),
              amount: totalRental,
            },
          ])

          // Show rental income notification every 4th interval (1 minute)
          if (Math.random() > 0.75) {
            showNotification(`You earned ${totalRental} $SUITES in rental income!`, "success")
          }
        }
      }, 15000) // Every 15 seconds for demo

      return () => clearInterval(rentalInterval)
    }
  }, [ownedProperties, showNotification])

  // Simulate property value appreciation over time
  useEffect(() => {
    if (ownedProperties.length > 0) {
      // Appreciate property values every 30 seconds
      const appreciationInterval = setInterval(() => {
        // Update owned properties with appreciated values
        setOwnedProperties((prevProperties) =>
          prevProperties.map((property) => {
            // Random appreciation between 0.5% and 1.5%
            const appreciationRate = 0.005 + Math.random() * 0.01
            const newPrice = Math.floor(property.price * (1 + appreciationRate))

            return {
              ...property,
              price: newPrice,
              originalPrice: property.originalPrice || property.price,
            }
          }),
        )
      }, 30000) // Every 30 seconds

      return () => clearInterval(appreciationInterval)
    }
  }, [ownedProperties])

  // Animate clouds
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds((prevClouds) =>
        prevClouds.map((cloud) => {
          let newX = cloud.x

          if (cloud.direction === "right") {
            newX = (cloud.x + cloud.speed) % 110
            if (newX > 105) newX = -10 // reset to left side when off-screen
          } else {
            newX = cloud.x - cloud.speed
            if (newX < -10) newX = 110 // reset to right side when off-screen
          }

          return {
            ...cloud,
            x: newX,
          }
        }),
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Handle building section click
  const handleSuiteClick = (suiteId: number) => {
    setSelectedSuite(suiteId)
    setIsFloorSelectorOpen(true)
  }

  // Handle floor selection
  const handleFloorSelect = (floorNumber: number) => {
    setSelectedFloor(floorNumber)
    setIsFloorSelectorOpen(false)

    // Generate floor layout for the selected floor
    const layout = generateFloorLayout(floorNumber, selectedSuite || 9)
    setFloorLayout(layout)

    // Open room layout modal
    setIsRoomLayoutOpen(true)
  }

  // Handle room selection
  const handleRoomSelect = (room: any) => {
    if (room.type === "room") {
      setSelectedRoom(room)
    }
  }

  // Close room layout
  const handleCloseRoomLayout = () => {
    setIsRoomLayoutOpen(false)
    setSelectedRoom(null)
  }

  // Handle change floor button click
  const handleChangeFloor = () => {
    // First close the room layout modal
    setIsRoomLayoutOpen(false)

    // Then open the floor selector modal after a short delay
    setTimeout(() => {
      setIsFloorSelectorOpen(true)
    }, 100)
  }

  // Handle close room layout and return to floor selector
  const handleCloseAndReturnToFloors = () => {
    handleCloseRoomLayout()
    setTimeout(() => {
      setIsFloorSelectorOpen(true)
    }, 100)
  }

  // Handle wallet connection - Simplified since we're auto-connecting
  const handleConnectWallet = () => {
    // Already connected by default
    setIsWalletModalOpen(false)
  }

  // Handle property purchase
  const handleBuyProperty = () => {
    if (!selectedRoom || !isWalletConnected) {
      // If wallet is not connected, prompt to connect
      if (!isWalletConnected) {
        showNotification("Please connect your wallet first!", "error")
        handleConnectWallet()
      }
      return
    }

    if (walletBalance < selectedRoom.price) {
      showNotification("Insufficient funds to purchase this property!", "error")
      return
    }

    // Update wallet balance
    setWalletBalance((prev) => prev - selectedRoom.price)

    // Add to owned properties with current timestamp for purchase time
    const purchaseTimestamp = Date.now()
    const newProperty = {
      ...selectedRoom,
      purchaseTime: purchaseTimestamp,
      isAvailable: false,
      owner: "You",
    }

    setOwnedProperties((prev) => [...prev, newProperty])
    setPurchaseTime(purchaseTimestamp)

    // Update floor layout to show ownership
    setFloorLayout((prev) =>
      prev.map((item) => (item.id === selectedRoom.id ? { ...item, isAvailable: false, owner: "You" } : item)),
    )

    // Update selected room
    setSelectedRoom({ ...selectedRoom, isAvailable: false, owner: "You", purchaseTime: purchaseTimestamp })

    // Show success message
    showNotification(`You just bought ${selectedRoom.roomType.name} #${selectedRoom.roomNumber}!`, "success")

    // Generate immediate rental income after 5 seconds
    setTimeout(() => {
      const rentalPerMinute = Math.round(selectedRoom.price * 0.0133)
      setRentalIncome((prev) => prev + rentalPerMinute)
      setWalletBalance((prev) => prev + rentalPerMinute)
      setTotalRentalEarned((prev) => prev + rentalPerMinute)
    }, 5000)
  }

  // Fix the realtor button functionality
  const handleRealtorClick = () => {
    // If we have properties, show the realtor modal with properties
    if (ownedProperties.length > 0) {
      // Calculate sell quotes for all properties
      const propertiesWithQuotes = ownedProperties.map((property) => {
        const holdingTime = currentTime - (property.purchaseTime || Date.now())
        let salePrice = property.price
        let sellPercentage = 0

        if (holdingTime < 5 * 60 * 1000) {
          // Less than 5 minutes - 80% return
          salePrice = Math.floor(property.price * 0.8)
          sellPercentage = -20
        } else if (holdingTime < 10 * 60 * 1000) {
          // Between 5-10 minutes - 95% return
          salePrice = Math.floor(property.price * 0.95)
          sellPercentage = -5
        } else {
          // More than 10 minutes - 106% return
          salePrice = Math.floor(property.price * 1.06)
          sellPercentage = 6
        }

        return {
          ...property,
          salePrice,
          sellPercentage,
          holdingTime,
        }
      })

      // Set the first property as selected if none is selected
      if (!selectedRoom || !ownedProperties.some((p) => p.id === selectedRoom.id)) {
        setSelectedRoom(propertiesWithQuotes[0])
        setSellPrice(propertiesWithQuotes[0].salePrice)
        setProfitPercentage(propertiesWithQuotes[0].sellPercentage)
      }
    }

    // Always open the realtor modal
    setIsRealtorModalOpen(true)
  }

  // Handle username/avatar click
  const handleUsernameClick = () => {
    setIsUsernameModalOpen(true)
  }

  // Replace the handleSellButtonClick function with this enhanced version
  const handleSellButtonClick = () => {
    if (selectedRoom && selectedRoom.owner === "You") {
      // Calculate sell price based on holding time
      const holdingTime = currentTime - (selectedRoom.purchaseTime || purchaseTime)
      let salePrice = selectedRoom.price
      let sellPercentage = 0

      if (holdingTime < 5 * 60 * 1000) {
        // Less than 5 minutes - 80% return
        salePrice = Math.floor(selectedRoom.price * 0.8)
        sellPercentage = -20
      } else if (holdingTime < 10 * 60 * 1000) {
        // Between 5-10 minutes - 95% return
        salePrice = Math.floor(selectedRoom.price * 0.95)
        sellPercentage = -5
      } else {
        // More than 10 minutes - 106% return (6% profit)
        salePrice = Math.floor(selectedRoom.price * 1.06)
        sellPercentage = 6
      }

      setSellPrice(salePrice)
      setProfitPercentage(sellPercentage)
      setIsSellingModalOpen(true)
    } else {
      showNotification("Please select a property you own first!", "error")
    }
  }

  // Handle sell property
  const handleSellProperty = () => {
    if (selectedRoom) {
      // Update wallet balance
      setWalletBalance((prev) => prev + sellPrice)

      // Remove from owned properties
      setOwnedProperties((prev) => prev.filter((property) => property.id !== selectedRoom.id))

      // Update floor layout to show availability
      setFloorLayout((prev) =>
        prev.map((item) => (item.id === selectedRoom.id ? { ...item, isAvailable: true, owner: "On Sale!" } : item)),
      )

      // Reset selected room
      setSelectedRoom(null)

      // Close selling modal
      setIsSellingModalOpen(false)

      // Show success message
      showNotification(`You sold your ${selectedRoom.roomType?.name} for ${sellPrice} $SUITES!`, "success")
    }
  }

  // Format holding time
  const formatHoldingTime = () => {
    if (selectedRoom) {
      const holdingTime = currentTime - (selectedRoom.purchaseTime || purchaseTime)
      const minutes = Math.floor(holdingTime / 60000)
      const seconds = Math.floor((holdingTime % 60000) / 1000)
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    return "0:00"
  }

  return (
    <div className="relative min-h-[1800px] w-full overflow-hidden">
      {/* Pixel Sky Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-sky-400 to-sky-300">
        {/* Pixel texture overlay */}
        <div className="absolute inset-0 pixel-grid opacity-10"></div>

        {/* Clouds */}
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute transition-transform duration-1000 ease-linear"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              transform: `scale(${cloud.size})`,
              zIndex: cloud.zIndex,
              transition: "left 2s linear",
            }}
          >
            <Image
              src={`/images/clouds/${cloud.image}`}
              alt="Cloud"
              width={200}
              height={120}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center p-4 pt-4 pb-0 md:p-8 md:pt-6 md:pb-0">
        {/* Game Menu Bar */}
        <div className="mb-10 w-full max-w-6xl">
          {/* Main Menu Container - Pixel Game UI Style */}
          <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-3 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
            {/* Add layered border effect */}
            <div className="absolute inset-0 -z-10 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
            <div className="absolute inset-0 -z-10 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>
            {/* Single Row Layout with Space Between */}
            <div className="flex items-center justify-between">
              {/* Left Side - Game Controls/Buttons */}
              <div className="flex items-center gap-4">
                {/* User Avatar and Name */}
                <div
                  onClick={handleUsernameClick}
                  className="pixel-border border-2 border-[#4e8eca] bg-[#132B50] pl-2 pr-4 py-2 flex items-center cursor-pointer hover:border-[#6A30C2]"
                >
                  <div className="mr-2 h-8 w-8 bg-[#6A30C2] rounded-full border-2 border-[#4e8eca] overflow-hidden flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-[#F0F0F0]" />
                  </div>
                  <span className="font-press-start text-sm text-[#00f0ff]">{username}</span>
                </div>

                {/* Realtor Button - Always show */}
                <button
                  onClick={handleRealtorClick}
                  className="pixel-button flex items-center border-3 px-4 py-2 font-press-start text-sm hover:from-[#7A40D2] hover:to-[#6A30C2] transition-all"
                >
                  <BuildingIcon className="h-5 w-5 mr-2" />
                  REALTOR
                </button>
              </div>

              {/* Right Side - Simulation Mode Indicator */}
              <div className="pixel-border flex items-center border-3 border-[#2C0E61] bg-[#6A30C2] px-4 py-2 font-press-start text-lg text-[#F0F0F0]">
                <span className="mr-2 h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
                SIMULATION MODE: ON
              </div>
            </div>

            {/* Bottom Row - Stats (Only show when connected) */}
            {isWalletConnected && (
              <div className="mt-3 pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-4 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)] relative">
                {/* Add layered border effect */}
                <div className="absolute inset-0 -z-10 bg-[#4e8eca] translate-x-2 translate-y-2 rounded-lg"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Balance */}
                  <div className="pixel-border border-2 border-[#4e8eca] bg-[#132B50] p-3 rounded">
                    <div className="font-press-start text-xs text-[#a4c2e0]">BALANCE</div>
                    <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                      <CoinsIcon className="h-4 w-4 mr-1" />
                      {animatedBalance}
                    </div>
                  </div>

                  {/* Rental Income */}
                  <div className="pixel-border border-2 border-[#4e8eca] bg-[#132B50] p-3 rounded">
                    <div className="font-press-start text-xs text-[#a4c2e0]">INCOME</div>
                    <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                      <PercentIcon className="h-4 w-4 mr-1" />+{rentalIncome}/min
                    </div>
                  </div>

                  {/* Total Earned */}
                  <div
                    className="pixel-border border-2 border-[#4e8eca] bg-[#132B50] p-3 rounded cursor-pointer hover:border-[#6A30C2] transition-all"
                    onClick={() => setIsEarningsModalOpen(true)}
                  >
                    <div className="font-press-start text-xs text-[#a4c2e0]">EARNED</div>
                    <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                      <TrendingUpIcon className="h-4 w-4 mr-1" />
                      {totalRentalEarned}
                    </div>
                  </div>

                  {/* Properties Owned */}
                  <div className="pixel-border border-2 border-[#4e8eca] bg-[#132B50] p-3 rounded">
                    <div className="font-press-start text-xs text-[#a4c2e0]">PROPERTIES</div>
                    <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      {ownedProperties.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building Container - directly on page */}
        <div className="relative mx-auto h-[1200px] w-full mb-0 pb-0">
          <TooltipProvider>
            {/* Stack images with custom positioning */}
            {[...Array(9)].map((_, index) => {
              const imageNumber = 9 - index // Reverse order (9, 8, 7, ..., 1)
              const isHovered = hoveredSuite === imageNumber

              return (
                <Tooltip key={imageNumber}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        // Use custom position for each image with original values
                        bottom: `${imagePositions[imageNumber as keyof typeof imagePositions]}px`,
                        // Adjust z-index to ensure proper stacking (9 at bottom, 1 at top)
                        zIndex: 10 - imageNumber,
                      }}
                      onMouseEnter={() => setHoveredSuite(imageNumber)}
                      onMouseLeave={() => setHoveredSuite(null)}
                      onClick={() => handleSuiteClick(imageNumber)}
                    >
                      <Image
                        src={`/images/building/${imageNumber}.webp`}
                        alt={`Suite ${imageNumber}`}
                        width={800}
                        height={640}
                        priority
                        style={{ objectFit: "contain" }}
                        className="pixelated" // Add pixelated rendering
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/80 text-white">
                    {suites[imageNumber - 1].name}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Floor Selector Modal */}
      {selectedSuite && (
        <Dialog open={isFloorSelectorOpen} onOpenChange={setIsFloorSelectorOpen}>
          <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-md max-h-[90vh] overflow-hidden">
            {/* Header with close button */}
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#2C0E61] bg-[#132B50] p-5">
              <div className="w-8"></div> {/* Spacer for balance */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">SELECT FLOOR</h2>
            </div>

            {/* Wallet Info Bar - Only show when connected */}
            {isWalletConnected && (
              <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-[#0f3443]/70 to-[#1a4a6a]/70 border-b-4 border-[#4e8eca]">
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">BALANCE</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <CoinsIcon className="h-4 w-4 mr-1" />
                    {animatedBalance}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">INCOME</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <PercentIcon className="h-4 w-4 mr-1" />+{rentalIncome}/min
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">OWNED</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <BuildingIcon className="h-4 w-4 mr-1" />
                    {ownedProperties.length}
                  </div>
                </div>
              </div>
            )}

            <div className="max-h-[300px] overflow-y-auto p-7">
              <div className="grid grid-cols-3 gap-5">
                {suites[selectedSuite - 1]?.floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => handleFloorSelect(floor)}
                    className="pixel-button aspect-square border-4 p-4 font-press-start text-2xl transition-all hover:bg-[#7A40D2] active:scale-95"
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Realtor Button - Only show when connected and owning properties */}
            {isWalletConnected && ownedProperties.length > 0 && (
              <div className="p-5 border-t-4 border-[#4e8eca] bg-gradient-to-r from-[#0f3443] to-[#1a4a6a] flex justify-center">
                <button
                  onClick={() => {
                    setIsFloorSelectorOpen(false)
                    setTimeout(() => setIsRealtorModalOpen(true), 100)
                  }}
                  className="pixel-button border-3 px-5 py-3 font-press-start text-lg hover:bg-[#7A40D2]"
                >
                  <UserIcon className="h-5 w-5 inline mr-2" />
                  REALTOR SERVICES
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Room Layout Modal */}
      <Dialog open={isRoomLayoutOpen} onOpenChange={handleCloseRoomLayout}>
        <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[800px]">
          <div className="flex h-[80vh] max-h-[700px] flex-col">
            {/* Header */}
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#4e8eca] bg-gradient-to-r from-[#0f3443] to-[#1a4a6a] p-5">
              <button
                onClick={handleChangeFloor}
                className="flex items-center font-press-start text-lg text-[#F0F0F0] hover:text-[#6A30C2]"
              >
                ← CHANGE FLOOR
              </button>
              <h2 className="font-press-start text-2xl text-[#00f0ff]">FLOOR {selectedFloor}</h2>
            </div>

            {/* Wallet Info Bar - Only show when connected */}
            {isWalletConnected && (
              <div className="grid grid-cols-4 gap-3 p-4 bg-gradient-to-r from-[#0f3443]/70 to-[#1a4a6a]/70 border-b-4 border-[#4e8eca]">
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">BALANCE</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <CoinsIcon className="h-4 w-4 mr-1" />
                    {animatedBalance}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">INCOME</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <PercentIcon className="h-4 w-4 mr-1" />+{rentalIncome}/min
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">EARNED</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                    {totalRentalEarned}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-press-start text-sm text-[#a4c2e0]">OWNED</div>
                  <div className="font-press-start text-lg text-[#00f0ff] flex items-center justify-center">
                    <BuildingIcon className="h-4 w-4 mr-1" />
                    {ownedProperties.length}
                  </div>
                </div>
              </div>
            )}

            {/* Room Grid */}
            <div
              className="flex-1 overflow-auto bg-gradient-to-b from-[#0f3443] to-[#1a4a6a] p-8 relative scanlines"
              style={{ maxHeight: "500px", overflowY: "scroll" }}
            >
              {/* Pixel grid background */}
              <div className="absolute inset-0 pixel-grid opacity-5"></div>

              <div
                className="relative h-[600px] w-full transform scale-75 origin-top mx-auto"
                style={{ minWidth: "800px", paddingBottom: "200px" }}
              >
                {/* Grid cells */}
                {floorLayout.map((cell) => (
                  <div
                    key={cell.id}
                    className={cn(
                      "absolute flex items-center justify-center pixel-border border-4 p-1 transition-all",
                      getCellTypeStyle(cell),
                      cell.type === "room" && selectedRoom?.id === cell.id ? "ring-4 ring-white" : "",
                    )}
                    style={{
                      left: `${cell.x * 12.5}%`,
                      top: `${cell.y * 12.5}%`,
                      width: `${cell.w * 12.5}%`,
                      height: `${cell.h * 12.5}%`,
                      imageRendering: "pixelated",
                      zIndex: cell.type === "room" ? 10 : 5,
                    }}
                    onClick={() => handleRoomSelect(cell)}
                  >
                    {getCellTypeContent(cell)}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with room details and action buttons */}
            <div className="pixel-border border-t-4 border-[#4e8eca] bg-gradient-to-r from-[#0f3443] to-[#1a4a6a] p-5">
              {selectedRoom && selectedRoom.type === "room" ? (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    <div className="text-center">
                      <div className="font-press-start text-sm text-gray-400">LOCATION</div>
                      <div className="font-press-start text-lg text-[#4e8eca]">{selectedRoom.location}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-press-start text-sm text-gray-400">ROOM NUMBER</div>
                      <div className="font-press-start text-lg text-[#4e8eca]">{selectedRoom.roomNumber}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-press-start text-sm text-gray-400">FLOOR</div>
                      <div className="font-press-start text-lg text-[#4e8eca]">{selectedFloor}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-press-start text-sm text-gray-400">OWNER</div>
                      <div className="font-press-start text-lg text-[#4e8eca]">{selectedRoom.owner}</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isWalletConnected && (
                    <div className="flex justify-center gap-5">
                      {selectedRoom.isAvailable ? (
                        <button
                          onClick={handleBuyProperty}
                          disabled={walletBalance < selectedRoom.price}
                          className={`pixel-button border-3 px-6 py-3 font-press-start text-lg ${
                            walletBalance < selectedRoom.price ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7A40D2]"
                          }`}
                        >
                          BUY FOR {selectedRoom.price} $SUITES
                        </button>
                      ) : selectedRoom.owner === "You" ? (
                        <button
                          onClick={handleSellButtonClick}
                          className="pixel-button border-3 px-6 py-3 font-press-start text-lg hover:bg-[#7A40D2]"
                        >
                          <UserIcon className="h-5 w-5 inline mr-2" />
                          SELL PROPERTY
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-press-start text-lg text-[#4e8eca]">SELECT A ROOM TO VIEW DETAILS</div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="pixel-border border-4 border-[#4e8eca] bg-[#1a1a2e] p-0 text-white sm:max-w-md">
          <div className="flex flex-col">
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#4e8eca] bg-gradient-to-r from-[#0f3443] to-[#1a4a6a] p-5">
              <div className="w-8"></div> {/* Spacer for balance */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">WALLET</h2>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selling Modal */}
      <Dialog open={isSellingModalOpen} onOpenChange={setIsSellingModalOpen}>
        <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-md">
          <div className="flex flex-col">
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#2C0E61] bg-[#132B50] p-5">
              <div className="w-8"></div> {/* Spacer */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">SELL PROPERTY</h2>
              <div className="w-8"></div> {/* Spacer */}
            </div>

            <div className="p-6 space-y-4">
              {selectedRoom && (
                <>
                  <div className="text-center mb-4">
                    <p className="font-press-start text-lg text-[#00f0ff] mb-1">
                      {selectedRoom.roomType?.name} #{selectedRoom.roomNumber}
                    </p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">
                      Floor {selectedRoom.location?.split(".")[0] || "?"}
                    </p>
                  </div>

                  <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a4a] p-4 rounded">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="font-press-start text-xs text-[#a4c2e0]">Purchase Price</p>
                        <p className="font-press-start text-lg text-[#F0F0F0]">
                          {selectedRoom.originalPrice || selectedRoom.price}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-press-start text-xs text-[#a4c2e0]">Current Value</p>
                        <p className="font-press-start text-lg text-[#F0F0F0]">{selectedRoom.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a4a] p-4 rounded">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-press-start text-sm text-[#a4c2e0]">Sell Price:</p>
                        <p className="font-press-start text-sm text-[#00f0ff]">{sellPrice} $SUITES</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-press-start text-sm text-[#a4c2e0]">Profit/Loss:</p>
                        <p
                          className="font-press-start text-sm"
                          style={{ color: profitPercentage >= 0 ? "#22c55e" : "#ef4444" }}
                        >
                          {profitPercentage}%
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-press-start text-sm text-[#a4c2e0]">Holding Time:</p>
                        <p className="font-press-start text-sm text-[#00f0ff]">{formatHoldingTime()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleSellProperty}
                      className="pixel-button border-3 px-6 py-3 font-press-start text-lg hover:bg-[#7A40D2]"
                    >
                      CONFIRM SALE
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Earnings Modal */}
      <Dialog open={isEarningsModalOpen} onOpenChange={setIsEarningsModalOpen}>
        <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-md">
          <div className="flex flex-col">
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#2C0E61] bg-[#132B50] p-5">
              <div className="w-8"></div> {/* Spacer */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">FINANCIAL STATEMENT</h2>
              <div className="w-8"></div> {/* Spacer */}
            </div>

            <div className="p-6 space-y-6">
              <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a4a] p-4 rounded">
                <h3 className="font-press-start text-lg text-[#00f0ff] mb-3 text-center">SUMMARY</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="font-press-start text-xs text-[#a4c2e0]">Total Balance</p>
                    <p className="font-press-start text-lg text-[#F0F0F0]">{walletBalance} $SUITES</p>
                  </div>
                  <div className="text-center">
                    <p className="font-press-start text-xs text-[#a4c2e0]">Total Earned</p>
                    <p className="font-press-start text-lg text-[#F0F0F0]">{totalRentalEarned} $SUITES</p>
                  </div>
                  <div className="text-center">
                    <p className="font-press-start text-xs text-[#a4c2e0]">Income Rate</p>
                    <p className="font-press-start text-lg text-[#F0F0F0]">{rentalIncome}/min</p>
                  </div>
                  <div className="text-center">
                    <p className="font-press-start text-xs text-[#a4c2e0]">Properties</p>
                    <p className="font-press-start text-lg text-[#F0F0F0]">{ownedProperties.length}</p>
                  </div>
                </div>
              </div>

              <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a4a] p-4 rounded">
                <h3 className="font-press-start text-lg text-[#00f0ff] mb-3 text-center">RECENT TRANSACTIONS</h3>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {earningsHistory.length > 0 ? (
                    earningsHistory
                      .slice()
                      .reverse()
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b border-[#4e8eca]/30 pb-2"
                        >
                          <div className="font-press-start text-xs text-[#a4c2e0]">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="font-press-start text-sm text-[#00f0ff]">+{entry.amount} $SUITES</div>
                        </div>
                      ))
                  ) : (
                    <p className="font-press-start text-sm text-center text-[#a4c2e0]">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Username Modal */}
      <Dialog open={isUsernameModalOpen} onOpenChange={setIsUsernameModalOpen}>
        <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-md">
          <div className="flex flex-col">
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#2C0E61] bg-[#132B50] p-5">
              <div className="w-8"></div> {/* Spacer */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">EDIT PROFILE</h2>
              <div className="w-8"></div> {/* Spacer */}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-[#6A30C2] rounded-full border-4 border-[#4e8eca] overflow-hidden flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-[#F0F0F0]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-press-start text-sm text-[#a4c2e0] block">USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={10}
                  className="w-full bg-[#1a1a4a] border-2 border-[#4e8eca] rounded p-2 font-press-start text-[#F0F0F0] focus:outline-none focus:border-[#6A30C2]"
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="pixel-button border-3 px-6 py-3 font-press-start text-lg hover:bg-[#7A40D2]"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Realtor Modal */}
      <Dialog open={isRealtorModalOpen} onOpenChange={setIsRealtorModalOpen}>
        <DialogContent className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-0 text-white sm:max-w-md max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="pixel-border flex items-center justify-between border-b-4 border-[#2C0E61] bg-[#132B50] p-5">
              <div className="w-8"></div> {/* Spacer */}
              <h2 className="font-press-start text-2xl text-[#F0F0F0]">REALTOR</h2>
              <div className="w-8"></div> {/* Spacer */}
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <h3 className="font-press-start text-lg text-[#00f0ff] text-center mb-4">YOUR PROPERTIES</h3>

              {ownedProperties.length > 0 ? (
                <div className="space-y-4">
                  {ownedProperties.map((property) => {
                    // Calculate sell price based on holding time
                    const holdingTime = currentTime - (property.purchaseTime || Date.now())
                    let salePrice = property.price
                    let sellPercentage = 0

                    if (holdingTime < 5 * 60 * 1000) {
                      // Less than 5 minutes - 80% return
                      salePrice = Math.floor(property.price * 0.8)
                      sellPercentage = -20
                    } else if (holdingTime < 10 * 60 * 1000) {
                      // Between 5-10 minutes - 95% return
                      salePrice = Math.floor(property.price * 0.95)
                      sellPercentage = -5
                    } else {
                      // More than 10 minutes - 106% return
                      salePrice = Math.floor(property.price * 1.06)
                      sellPercentage = 6
                    }

                    // Format holding time
                    const minutes = Math.floor(holdingTime / 60000)
                    const seconds = Math.floor((holdingTime % 60000) / 1000)
                    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`

                    return (
                      <div
                        key={property.id}
                        className={`pixel-border border-2 ${selectedRoom?.id === property.id ? "border-[#6A30C2]" : "border-[#4e8eca]"} bg-[#1a1a4a] p-4 rounded cursor-pointer hover:border-[#6A30C2]`}
                        onClick={() => {
                          setSelectedRoom(property)
                          setSellPrice(salePrice)
                          setProfitPercentage(sellPercentage)
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-press-start text-sm text-[#00f0ff]">
                            {property.roomType?.name} #{property.roomNumber}
                          </div>
                          <div className="font-press-start text-xs text-[#a4c2e0]">
                            Floor {property.location?.split(".")[0] || "?"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-press-start text-[#a4c2e0]">Value: </span>
                            <span className="font-press-start text-[#F0F0F0]">{property.price}</span>
                          </div>
                          <div>
                            <span className="font-press-start text-[#a4c2e0]">Quote: </span>
                            <span className="font-press-start text-[#F0F0F0]">{salePrice}</span>
                          </div>
                          <div>
                            <span className="font-press-start text-[#a4c2e0]">Profit: </span>
                            <span
                              className="font-press-start"
                              style={{ color: sellPercentage >= 0 ? "#22c55e" : "#ef4444" }}
                            >
                              {sellPercentage}%
                            </span>
                          </div>
                          <div>
                            <span className="font-press-start text-[#a4c2e0]">Held: </span>
                            <span className="font-press-start text-[#F0F0F0]">{formattedTime}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-press-start text-[#a4c2e0] mb-4">NO PROPERTIES OWNED AT THIS TIME.</p>
                  <p className="font-press-start text-[#a4c2e0]">BUY A PROPERTY TO GET ACCESS TO THE REALTOR!</p>
                </div>
              )}
            </div>

            {selectedRoom && (
              <div className="p-6 border-t-4 border-[#4e8eca] bg-gradient-to-r from-[#0f3443] to-[#1a4a6a] flex justify-center">
                <button
                  onClick={() => {
                    setIsRealtorModalOpen(false)
                    setIsSellingModalOpen(true)
                  }}
                  className="pixel-button border-3 px-6 py-3 font-press-start text-lg hover:bg-[#7A40D2]"
                >
                  SELL SELECTED PROPERTY
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
