import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';
import { useProduct } from '../store/useProduct';
import RenewModal from '../components/Product/RenewModal';
import Listings from '../components/AdPage/Listings';

function AddPage() {

  const {renewLisitng} = useProduct();

  return (
    <>
      <Header></Header>

      <div className="z-1000 min-h-screen bg-[#F3F4F6]">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="hidden w-64 lg:block">
            <Sidebar />
          </div>

          <Listings />
        </div>
      </div>

      {renewLisitng && <RenewModal />}
    </>
  );
}

export default AddPage;
