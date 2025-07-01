import React from 'react';
import '../styles/TecladoNumerico.css';

interface TecladoNumericoProps {
  onNumberClick: (number: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEnter: () => void;
}

const TecladoNumerico: React.FC<TecladoNumericoProps> = ({
  onNumberClick,
  onDelete,
  onClear,
  onEnter
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="teclado-numerico">
      <div className="teclado-grid">
        {numbers.slice(0, 9).map((num) => (
          <button
            key={num}
            className="teclado-btn"
            onClick={() => onNumberClick(num)}
            type="button"
          >
            {num}
          </button>
        ))}
        <button
          className="teclado-btn teclado-btn-clear"
          onClick={onClear}
          type="button"
        >
          C
        </button>
        <button
          className="teclado-btn"
          onClick={() => onNumberClick('0')}
          type="button"
        >
          0
        </button>
        <button
          className="teclado-btn teclado-btn-delete"
          onClick={onDelete}
          type="button"
        >
          ←
        </button>
      </div>
      <button
        className="teclado-btn-enter"
        onClick={onEnter}
        type="button"
      >
        CONTINUAR
      </button>
    </div>
  );
};

export default TecladoNumerico;