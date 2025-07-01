// src/services/turnoService.ts
import prisma from '../prisma'

export class TurnoService {
  static async obtenerUltimoNumero(prefijo: 'B' | 'M'): Promise<number> {
    // Para números M, buscar en turnoMesaEntrada
    if (prefijo === 'M') {
      const ultimoTurno = await prisma.turnoMesaEntrada.findFirst({
        where: {
          numeroTurno: {
            startsWith: 'M'
          }
        },
        orderBy: {
          numeroTurno: 'desc'
        }
      })

      if (!ultimoTurno || !ultimoTurno.numeroTurno) {
        return 0
      }

      const numero = parseInt(ultimoTurno.numeroTurno.substring(1))
      return isNaN(numero) ? 0 : numero
    }
    
    // Para números B, buscar en usuario
    const ultimoTurno = await prisma.usuario.findFirst({
      where: {
        numeroTurno: {
          startsWith: 'B'
        }
      },
      orderBy: {
        numeroTurno: 'desc'
      }
    })

    if (!ultimoTurno || !ultimoTurno.numeroTurno) {
      return 0
    }

    const numero = parseInt(ultimoTurno.numeroTurno.substring(1))
    return isNaN(numero) ? 0 : numero
  }

  static async generarNumeroTurnoConCita(): Promise<string> {
    const ultimoNumero = await this.obtenerUltimoNumero('B')
    const nuevoNumero = ultimoNumero + 1
    return `B${nuevoNumero.toString().padStart(3, '0')}`
  }

  static async generarNumeroTurnoMesaEntrada(): Promise<string> {
    const ultimoNumero = await this.obtenerUltimoNumero('M')
    const nuevoNumero = ultimoNumero + 1
    return `M${nuevoNumero.toString().padStart(3, '0')}`
  }
}