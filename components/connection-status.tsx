"use client"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const { isConnected } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            Connected to Backend
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Backend Offline (Demo Mode)
          </>
        )}
      </Badge>
    </div>
  )
}
