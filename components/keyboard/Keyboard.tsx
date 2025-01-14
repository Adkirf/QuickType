import React from 'react'
import { Button } from "@/components/ui/button"
import { KeyColor } from '@/lib/projectTypes'

interface KeyProps {
  label: string
  color?: KeyColor
  className?: string
}

const Key: React.FC<KeyProps> = ({ label, color = 'default', className = '' }) => {
  const colorClasses = {
    default: 'bg-white hover:bg-gray-100',
    red: 'bg-red-200 hover:bg-red-300',
    yellow: 'bg-yellow-200 hover:bg-yellow-300',
    green: 'bg-green-200 hover:bg-green-300',
  }

  return (
    <Button
      variant="outline"
      className={`p-2 text-sm font-medium ${colorClasses[color]} ${className}`}
      aria-label={label}
    >
      {label}
    </Button>
  )
}

interface KeyboardProps {
  keyColors: { [key: string]: KeyColor }
}

export default function Keyboard({ keyColors = {} }: KeyboardProps) {
  console.log('Keyboard received keyColors:', keyColors);

  const keyboardLayout = [
    ['°', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´'],
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', '#'],
    ['<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
  ]

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => (
              <Key
                key={key}
                label={key}
                color={keyColors[key.toLowerCase()] || 'default'}
                className={key === ' ' ? 'flex-grow' : ''}
              />
            ))}
          </div>
        ))}
        <div className="flex justify-center space-x-1">
          <Key label="Ctrl" className="flex-grow-0 w-16" />
          <Key label="Alt" className="flex-grow-0 w-16" />
          <Key label=" " className="flex-grow" />
          <Key label="AltGr" className="flex-grow-0 w-16" />
          <Key label="Ctrl" className="flex-grow-0 w-16" />
        </div>
      </div>
    </div>
  )
}