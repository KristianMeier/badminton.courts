import React, { useState, useEffect, useCallback } from 'react'
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
} from '@mui/material'

function BadmintonCoachApp() {
  const generateRandomPlayers = () => {
    return Array.from({ length: 24 }, (_, index) => ({
      name: `Player ${index + 1}`,
      skillLevel: Math.floor(Math.random() * 5) + 1,
    }))
  }

  const [players, setPlayers] = useState(generateRandomPlayers())
  const [newPlayer, setNewPlayer] = useState({ name: '', skillLevel: '' })
  const [courts, setCourts] = useState(Array(6).fill([]))

  useEffect(() => {
    const storedPlayers = localStorage.getItem('players')
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers))
    }
  }, [])

  const distributePlayers = useCallback(() => {
    let sortedPlayers = [...players].sort((a, b) => a.skillLevel - b.skillLevel)
    let newCourts = Array(6)
      .fill()
      .map(() => [])

    sortedPlayers.forEach((player, index) => {
      newCourts[index % 6].push(player)
    })

    setCourts(newCourts)
  }, [players])

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players))
    distributePlayers()
  }, [players, distributePlayers])

  const handleInputChange = (e) => {
    setNewPlayer({ ...newPlayer, [e.target.name]: e.target.value })
  }

  const addPlayer = () => {
    if (newPlayer.name && newPlayer.skillLevel) {
      setPlayers([...players, newPlayer])
      setNewPlayer({ name: '', skillLevel: '' })
    }
  }

  const getTotalSkillLevel = (court) => {
    return court.reduce((total, player) => total + player.skillLevel, 0)
  }

  return (
    <Container>
      <Paper style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h4">Badminton Coach App</Typography>
        <Grid
          container
          spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}>
            <TextField
              label="Player Name"
              name="name"
              value={newPlayer.name}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <TextField
              label="Skill Level (1-5)"
              name="skillLevel"
              type="number"
              value={newPlayer.skillLevel}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={addPlayer}
          style={{ marginTop: '20px' }}>
          Add Player
        </Button>

        <Typography
          variant="h6"
          style={{ marginTop: '20px' }}>
          Courts Assignment
        </Typography>
        {courts.map((court, index) => (
          <Box
            key={index}
            mb={4}>
            <Typography variant="h6">
              Court {index + 1} (Total Skill: {getTotalSkillLevel(court)})
            </Typography>
            {court.map((player, idx) => (
              <React.Fragment key={idx}>
                <Typography>
                  {player.name} (Level: {player.skillLevel})
                </Typography>
                {idx % 2 === 1 && <Divider style={{ margin: '8px 0' }} />}
              </React.Fragment>
            ))}
          </Box>
        ))}
      </Paper>
    </Container>
  )
}

export default BadmintonCoachApp
