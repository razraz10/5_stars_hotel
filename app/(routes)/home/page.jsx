import React from 'react'
import { Hotel, Phone, Mail, MapPin, Star, Coffee, Wifi, Car } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function page() {
  return (
    <div className="">
      <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">השירותים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Coffee className="h-8 w-8" />, title: "ארוחת בוקר", desc: "ארוחת בוקר גורמה" },
              { icon: <Wifi className="h-8 w-8" />, title: "אינטרנט חופשי", desc: "Wi-Fi מהיר בכל החדרים" },
              { icon: <Car className="h-8 w-8" />, title: "חניה", desc: "חניה חופשית לאורחים" },
              { icon: <Star className="h-8 w-8" />, title: "שירות 24/7", desc: "צוות מקצועי לשירותכם" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Preview */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">החדרים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "סוויטה יוקרתית",
                price: "1,200₪"
              },
              {
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
                title: "חדר דלקס",
                price: "800₪"
              },
              {
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "חדר סטנדרט",
                price: "600₪"
              }
            ].map((room, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                  <p className="text-gray-600 mb-4">החל מ-{room.price} ללילה</p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">צור קשר</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">טלפון</h3>
              <p className="text-gray-600">03-1234567</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">אימייל</h3>
              <p className="text-gray-600">info@luxury-hotel.com</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">כתובת</h3>
              <p className="text-gray-600">רחוב הים 123, תל אביב</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Hotel size={24} />
            <span className="text-xl font-bold">מלון היוקרה</span>
          </div>
          <div className="text-center md:text-right">
            <p>© 2025 מלון היוקרה. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
      </div>
      <Toaster/>
    </div>
  )
}
