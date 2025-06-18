import { useState } from 'react'
import LeftSideDeatil from './LeftSideDeatil'
import RightSideDeatil from './RightSideDeatil'
import PropertyMap from './PropertyMap'
import Header from '../../components/Header'

const PropertyListing = () => {
    const propertyImages = [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]

    const propertyData = {
        title: "Discover a wide range of certified flats, apartments, houses, plots, and commercial...",
        price: "₹ 2.15 Crore",
        configuration: {
            bedrooms: 3,
            bathrooms: 3,
            balconies: 2
        },
        area: {
            type: "Super Built up area",
            value: "2020"
        },
        postedBy: {
            name: "Investwell Homes",
            memberSince: "Oct 2022",
            itemsListed: 20
        },
        location: {
            area: "Sector 104, Noida, Uttar Pradesh",
            coordinates: [28.5355, 77.3910]
        },
        floorDetails: {
            floor: "10th",
            totalFloors: "48 Floors"
        },
        possession: "Within 6 months",
        verified: true,
        ownerPosting: true,
        description: "Welcome to our Properties section PropertyListing– your one-stop destination for finding the perfect place to live, invest, or grow your business. Whether you're searching for a cozy 1BHK apartment, a spacious villa, a commercial office space, or a prime land plot, we offer a wide range of certified listings to fulfill all your real estate needs. From luxury residences to budget-friendly housing options to luxury residences, we cover all categories, including fully furnished, semi-furnished, and unfurnished properties. You can filter your search by price, amenities, bed configurations, and property type to find exactly what you're looking for. We cater to both buyers and renters, offering up-to-date listings with high-quality images, accurate floor plans, and detailed information about each property. Whether you are a student, working professional, family, or investor, our platform provides the tools and resources to make informed real estate decisions. Looking to invest? Explore properties in developing areas and hot locations that offer great future returns. Our property advisors and partners work closely to ensure that every listing is legal, verified, and ready for immediate possession or development."
    }

    return (
        <>   <Header />

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-xl overflow-hidden ">
                    <div className="relative">
                        <LeftSideDeatil data={propertyData} images={propertyImages} />
                    </div>
                    <div className="flex flex-col gap-6">
                        <RightSideDeatil data={propertyData} />
                        <PropertyMap coordinates={propertyData.location.coordinates} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PropertyListing