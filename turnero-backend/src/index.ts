import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma'
import { TurnoService } from './services/turnoService'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Endpoint para buscar si un DNI tiene turno
app.get('/api/turnos/:dni', async (req: any, res: any) => {
  const { dni } = req.params

  try {
    const dniNumber = parseInt(dni, 10)
    
    if (isNaN(dniNumber)) {
      return res.status(400).json({ error: 'DNI inválido' })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { dni: dniNumber }
    })

    if (usuario) {
      let numeroTurno = usuario.numeroTurno
      
      // Si no tiene número de turno, generar uno nuevo con B
      if (!numeroTurno) {
        numeroTurno = await TurnoService.generarNumeroTurnoConCita()
        
        await prisma.usuario.update({
          where: { dni: dniNumber },
          data: { 
            numeroTurno,
            createdAt: new Date()
          }
        })
      }
      
      res.json({ 
        tieneTurno: true, 
        turno: {
          ...usuario,
          numeroTurno
        }
      })
    } else {
      // Usuario sin turno previo - verificar si ya tiene número M asignado
      const turnoMesaExistente = await prisma.turnoMesaEntrada.findFirst({
        where: { dni: dniNumber },
        orderBy: { createdAt: 'desc' }
      })

      if (turnoMesaExistente && turnoMesaExistente.numeroTurno) {
        // Ya tiene número asignado, devolver el mismo
        res.json({ 
          tieneTurno: false,
          numeroTurno: turnoMesaExistente.numeroTurno
        })
      } else {
        // No tiene número, generar uno nuevo
        const numeroTurno = await TurnoService.generarNumeroTurnoMesaEntrada()
        
        // Guardar en la tabla de mesa de entrada
        await prisma.turnoMesaEntrada.create({
          data: {
            dni: dniNumber,
            numeroTurno
          }
        })
        
        res.json({ 
          tieneTurno: false,
          numeroTurno
        })
      }
    }
  } catch (error) {
    console.error('Error al consultar la base de datos:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})