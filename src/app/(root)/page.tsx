import Featured from "@/components/Featured.component";
import Offer from "@/components/Offer.component";
import Slider from "@/components/Slider.component";



export default function Home() {
  return (
    <div>
      <Slider />
      <Featured/>
      <Offer/>
    </div>
  );
}
