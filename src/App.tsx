import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import SaveDateScene from "./sections/SaveDateScene";
import PageBackdrop from "./components/PageBackdrop";
import Journey from "./sections/Journey";
import FeastScene from "./sections/FeastScene";
import RitualsScene from "./sections/RitualsScene";
import Interlude from "./sections/Interlude";
import VenueSection from "./sections/VenueSection";
import FooterSection from "./sections/FooterSection";
import RsvpSection from "./sections/RsvpSection";

export default function App() {
  useEffect(() => { document.title = "Charu & Vaibhav · Wedding Invitation"; }, []);
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Journey />
        <PageBackdrop>
          <SaveDateScene />
          <FeastScene />
          <Interlude />
          <RitualsScene />
          <VenueSection />
          <RsvpSection />
          <FooterSection />
        </PageBackdrop>
      </main>
    </MotionConfig>
  );
}
