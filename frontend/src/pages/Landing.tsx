import { useState, useRef } from "react";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";

import { Preloader } from "../components/landing/Preloader";
import { KnowledgeLoomCanvas } from "../components/landing/KnowledgeLoomCanvas";
import { EditorialNav } from "../components/landing/EditorialNav";
import { HeroSection } from "../components/landing/HeroSection";
import { LiveArticleStream } from "../components/landing/LiveArticleStream";
import { ManifestoSection } from "../components/landing/ManifestoSection";
import { TopicIndexSection } from "../components/landing/TopicIndexSection";
import { FeaturedArticleSection } from "../components/landing/FeaturedArticleSection";
import { PublishingJourney } from "../components/landing/PublishingJourney";
import { LiveEditorDemo } from "../components/landing/LiveEditorDemo";
import { CodeContentSection } from "../components/landing/CodeContentSection";
import { WriterCTASection } from "../components/landing/WriterCTASection";
import { AuthorShowcaseSection } from "../components/landing/AuthorShowcaseSection";
import { TrendingListSection } from "../components/landing/TrendingListSection";
import { SearchModal } from "../components/landing/SearchModal";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { LandingFooter } from "../components/landing/LandingFooter";

export default function Landing() {
  const { loading, blogs } = useBlogs({ limit: 12 });
  const [searchOpen, setSearchOpen] = useState(false);
  const liveStreamRef = useRef<HTMLDivElement | null>(null);

  const featuredArticle = blogs.length > 0 ? blogs[0] : null;

  const scrollToStream = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-loom selection:text-black overflow-x-hidden">
      <Seo
        title="Devloom | Where Developers Think Out Loud"
        description="A serious publishing destination for developers to share technical deep dives, architectural notes, post-mortems, and engineering insights."
        url="https://devloom.com"
      />

      {/* Preloader */}
      <Preloader />

      {/* Background Knowledge Loom Canvas */}
      <KnowledgeLoomCanvas />

      {/* Navigation */}
      <EditorialNav onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        {/* Section 03: Hero */}
        <HeroSection onExploreClick={scrollToStream} />

        {/* Section 04: Live Article Stream */}
        <div ref={liveStreamRef}>
          <LiveArticleStream blogs={blogs} loading={loading} />
        </div>

        {/* Section 05: Editorial Manifesto */}
        <ManifestoSection />

        {/* Section 06: Knowledge Domains / Topics */}
        <TopicIndexSection />

        {/* Section 07: Featured Article Cover Story */}
        <FeaturedArticleSection featured={featuredArticle} />

        {/* Section 08: Publishing Journey Lifecycle */}
        <PublishingJourney />

        {/* Section 09: Live Editor Demonstration */}
        <LiveEditorDemo />

        {/* Section 10: Code + Content Showcase */}
        <CodeContentSection />

        {/* Section 11: Writer/Creator CTA */}
        <WriterCTASection />

        {/* Section 12: Community Author Showcase */}
        <AuthorShowcaseSection blogs={blogs} />

        {/* Section 13: Trending Reading List */}
        <TrendingListSection blogs={blogs} />

        {/* Section 15: Final CTA */}
        <FinalCTASection />
      </main>

      {/* Section 16: Statement Footer */}
      <LandingFooter />

      {/* Command Palette Search Overlay (Section 14) */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
