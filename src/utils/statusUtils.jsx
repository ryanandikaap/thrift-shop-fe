export const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Menunggu Pembayaran';
    case 'paid':
      return 'Dibayar';
    case 'shipped':
      return 'Dikirim';
    case 'completed':
      return 'Selesai';
    default:
      return status;
  }
};

export const getStatusComponent = (status, IconComponent) => {
  switch (status) {
    case 'pending':
      return <span className="status-badge pending"><IconComponent size={14} /> Menunggu Pembayaran</span>;
    case 'paid':
      return <span className="status-badge paid"><IconComponent size={14} /> Dibayar</span>;
    case 'shipped':
      return <span className="status-badge shipped"><IconComponent size={14} /> Dikirim</span>;
    case 'completed':
      return <span className="status-badge completed"><IconComponent size={14} /> Selesai</span>;
    default:
      return <span className="status-badge">{status}</span>;
  }
};