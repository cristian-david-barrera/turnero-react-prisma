import React, { useState, useEffect, useRef } from 'react';
import TecladoNumerico from './TecladoNumerico';
import '../styles/TurneroInicio.css';

type Props = {
  onDniIngresado: (dni: string | null) => void;
};

type TurnoResponse = {
  tieneTurno: boolean;
  turno?: {
    dni: number;
    nombre?: string;
    apellido?: string;
    fecha?: string;
    numeroTurno?: string;
  };
  numeroTurno?: string;
  error?: string;
};

const TurneroInicio: React.FC<Props> = ({ onDniIngresado }) => {
  const [dni, setDni] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('readonly', 'true');
    }
  }, []);

  const imprimirTicket = (numeroTurno: string, turno?: TurnoResponse['turno']) => {
    const ventanaImpresion = window.open('', '_blank', 'width=300,height=400');
    if (!ventanaImpresion) return;

    const esMesaEntrada = numeroTurno.startsWith('M');

    const contenidoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket de Turno</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .ticket {
            border: 2px dashed #333;
            padding: 20px;
            max-width: 250px;
            margin: 0 auto;
          }
          .numero-turno {
            font-size: 72px;
            font-weight: bold;
            margin: 30px 0;
            color: ${esMesaEntrada ? '#dc3545' : '#0066cc'};
          }
          .tipo-turno {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
          }
          .info {
            margin: 10px 0;
            font-size: 14px;
          }
          .fecha-hora {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          hr {
            border: 1px dashed #ccc;
            margin: 15px 0;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="ticket">
          <h2>MUNICIPALIDAD</h2>
          <h3>Licencias de Conducir</h3>
          <hr>
          <div class="numero-turno">${numeroTurno}</div>
          ${esMesaEntrada ? `
            <div class="tipo-turno">MESA DE ENTRADA</div>
          ` : `
            <div class="tipo-turno">TURNO CON CITA</div>
            ${turno ? `
              <hr>
              <div class="info">
                <strong>${turno.nombre || ''} ${turno.apellido || ''}</strong><br>
                DNI: ${turno.dni}
              </div>
              ${turno.fecha ? `
                <div class="info">
                  <strong>Turno:</strong> ${turno.fecha}
                </div>
              ` : ''}
            ` : ''}
          `}
          <hr>
          <div class="fecha-hora">
            ${new Date().toLocaleString('es-AR')}
          </div>
          <div style="margin-top: 20px; font-size: 10px;">
            Conserve este ticket hasta ser llamado
          </div>
        </div>
      </body>
      </html>
    `;

    ventanaImpresion.document.write(contenidoHTML);
    ventanaImpresion.document.close();
  };

const procesarConsulta = async () => {
  if (!/^\d{7,8}$/.test(dni)) {
    setMensaje("Por favor, ingrese un DNI válido (7 u 8 dígitos).");
    setTimeout(() => setMensaje(""), 3000);
    return;
  }

  setLoading(true);
  
  try {
    const response = await fetch(`http://localhost:3002/api/turnos/${dni}`);
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const data: TurnoResponse = await response.json();
    
    // AQUÍ VAN LOS 4 CONSOLE.LOG
    console.log('Respuesta completa del backend:', JSON.stringify(data, null, 2));
    console.log('tieneTurno:', data.tieneTurno);
    console.log('turno:', data.turno);
    console.log('numeroTurno (mesa):', data.numeroTurno);

    // Verificar explícitamente el valor booleano
    if (data.tieneTurno === true && data.turno) {
      console.log('ENTRANDO A: Usuario CON turno previo');
      
      const numeroTurno = data.turno.numeroTurno;
      
      if (numeroTurno) {
        const nombreCompleto = data.turno.nombre 
          ? `${data.turno.nombre} ${data.turno.apellido || ''}`.trim()
          : 'Usuario';
          
        const mensajeConTurno = `¡Bienvenido ${nombreCompleto}! Su número de turno es: ${numeroTurno}`;
        console.log('Mensaje a mostrar:', mensajeConTurno);
        setMensaje(mensajeConTurno);
        
        setTimeout(() => {
          imprimirTicket(numeroTurno, data.turno);
        }, 500);
      }
    } else if (data.tieneTurno === false) {
      console.log('ENTRANDO A: Usuario SIN turno previo');
      
      const numeroMesa = data.numeroTurno;
      
      if (numeroMesa) {
        const mensajeSinTurno = `Usted no posee turno, será atendido por mesa de entrada. Su número es: ${numeroMesa}`;
        console.log('Mensaje a mostrar:', mensajeSinTurno);
        setMensaje(mensajeSinTurno);
        
        setTimeout(() => {
          imprimirTicket(numeroMesa);
        }, 500);
      } else {
        setMensaje("Usted no posee turno, será atendido por mesa de entrada.");
      }
    }

    onDniIngresado(dni);
    
    setTimeout(() => {
      onDniIngresado(null);
      setMensaje("");
      setDni("");
    }, 7000);
    
  } catch (error) {
    console.error("Error al consultar la API:", error);
    setMensaje("Ocurrió un error al consultar el turno. Por favor, intente nuevamente.");
    setTimeout(() => {
      setMensaje("");
      setDni("");
    }, 5000);
  } finally {
    setLoading(false);
  }
};

  const handleNumberClick = (number: string) => {
    if (dni.length < 8) {
      setDni(dni + number);
      setMensaje("");
    }
  };

  const handleDelete = () => {
    setDni(dni.slice(0, -1));
    setMensaje("");
  };

  const handleClear = () => {
    setDni("");
    setMensaje("");
  };

  const handleEnter = () => {
    procesarConsulta();
  };

  return (
    <div className="turnero-container">
      <h1 className="turnero-titulo">Turnos Licencia de Conducir</h1>
      <h2>Ingrese su DNI</h2>
      
      <div className="dni-display">
        <input 
          ref={inputRef}
          type="text" 
          value={dni} 
          placeholder="DNI"
          readOnly
          className="dni-input"
        />
      </div>

      <TecladoNumerico
        onNumberClick={handleNumberClick}
        onDelete={handleDelete}
        onClear={handleClear}
        onEnter={handleEnter}
      />

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('mesa de entrada') ? 'mensaje-mesa-entrada' : ''} ${loading ? 'loading' : ''}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default TurneroInicio;