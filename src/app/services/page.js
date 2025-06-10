"use client"

import { useState, useEffect } from "react"

export default function ServicesPage() {
  const [services, setServices] = useState([])

  // Örnek hizmetler - Daha sonra API'den alınacak
  const dummyServices = [
    {
      id: 1,
      name: "Saç Kesimi",
      description: "Profesyonel saç kesimi hizmeti",
      price: "150₺",
      duration: "30 dk"
    },
    {
      id: 2,
      name: "Saç Boyama",
      description: "Her türlü saç boyama işlemi",
      price: "400₺",
      duration: "120 dk"
    },
    {
      id: 3,
      name: "Sakal Tıraşı",
      description: "Profesyonel sakal tıraşı ve şekillendirme",
      price: "100₺",
      duration: "20 dk"
    }
  ]

  useEffect(() => {
    setServices(dummyServices)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.id}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {service.description}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-semibold">{service.price}</p>
              <p className="text-sm text-muted-foreground">{service.duration}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 