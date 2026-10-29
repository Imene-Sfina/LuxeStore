import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 size={17} color="var(--green)" />,
    error:   <XCircle     size={17} color="var(--red)"   />,
    info:    <Info        size={17} color="var(--accent)" />,
  };

  return (
    <div className={`toast ${type}`}>
      {icons[type]}
      {message}
    </div>
  );
}
