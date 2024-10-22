'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteUserAccount, logout } from "@/lib/firebase/auth"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LoginForm from "./LoginForm"
import { useAuth } from "./context/AuthProvider"

// Mock data for the history chart
const historyData = [
  { date: '2023-06-01', wpm: 45 },
  { date: '2023-06-08', wpm: 48 },
  { date: '2023-06-15', wpm: 52 },
  { date: '2023-06-22', wpm: 55 },
  { date: '2023-06-29', wpm: 58 },
]

// Mock data for the leaderboard
const leaderboardData = [
  { rank: 1, username: 'LegalEagle', score: 980 },
  { rank: 2, username: 'JuristPro', score: 945 },
  { rank: 3, username: 'LawTypist', score: 920 },
  { rank: 4, username: 'CodexMaster', score: 905 },
  { rank: 5, username: 'ParaLegal', score: 890 },
]

export function ProfilePageComponent() {
  const { user, userProfile } = useAuth();

  if (!user) return <LoginForm />;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Profil</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={logout} variant="outline">Abmelden</Button>
            <Button onClick={deleteUserAccount} variant="destructive">Konto löschen</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`https://robohash.org/${userProfile?.username}.png`} alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">MaxMustermann</h2>
              <Badge className="mt-1">Score: 920</Badge>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Fortschritt</h3>
              <Card className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="wpm" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Bestenliste</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rang</TableHead>
                    <TableHead>Benutzername</TableHead>
                    <TableHead className="text-right">Punktzahl</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((player) => (
                    <TableRow key={player.rank}>
                      <TableCell className="font-medium">{player.rank}</TableCell>
                      <TableCell>{player.username}</TableCell>
                      <TableCell className="text-right">{player.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}