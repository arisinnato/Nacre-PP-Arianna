import React from 'react';

export const CartModal = ({ isOpen, onClose, cart }) => {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const enviarWhatsApp = async () => {
    try {
      for (const item of cart) {
        await fetch("https://nacre.onrender.com/api/sales/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.quantity,
            status: "pedido"
          }),
        });
      }

      const baseLink = "https://wa.me/584245822186?text=";
      let detallePedido = "¡Hola! Somos Nacre y este es tu pedido:\n\n";
      
      cart.forEach((item) => {
        detallePedido += `${item.name}\n`;
        detallePedido += `   Cant: ${item.quantity} x $${item.price.toFixed(2)}\n\n`;
      });
      
      detallePedido += `*Total a pagar: $${total.toFixed(2)}*\n\n`;
      detallePedido += "¿Me podrían indicar los pasos para concretar el pago?";

      const linkFinal = baseLink + encodeURIComponent(detallePedido);
      window.open(linkFinal, '_blank');
      
      onClose();

    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un problema al conectar con el servidor, pero puedes contactarnos por WhatsApp directamente.");
      
      const linkEmergencia = "https://wa.me/584245822186";
      window.open(linkEmergencia, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" 
        onClick={onClose}
      ></div>

      <div className="w-full max-w-md h-full relative z-10 flex flex-col bg-white/60 backdrop-blur-xl shadow-2xl border-l border-white/20 animate-fade-in-right">
        
        <div className="p-8 border-b border-black/5 flex justify-between items-center">
          <h2 className="text-xl font-serif tracking-widest uppercase text-black/80">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 font-serif italic">Tu joyero está esperando...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-medium mb-1 text-black/90">{item.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-mono text-black/90">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-black/5 bg-black/[0.02]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Subtotal</span>
              <span className="text-xl font-mono text-black/90">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={enviarWhatsApp}
              className="w-full bg-black/90 backdrop-blur-sm text-white py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-md"
            >
              Finalizar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;