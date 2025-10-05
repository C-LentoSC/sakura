import Image from 'next/image';

export default function CherryBlossomTrees() {
  return (
    <>
      {/* Left Side Cherry Blossom Tree - Top */}
      <div className="fixed left-0 top-20 bottom-0 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/L-tree.png"
          alt="Left Cherry Blossom Tree"
          width={1920}
          height={1000}
          className="h-36 sm:h-40 sm:w-40 lg:h-50 lg:w-100 object-cover opacity-60 sm:opacity-70 lg:opacity-80"
        />
      </div>

      {/* Left Side Cherry Blossom Tree - Bottom */}
      <div className="fixed left-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/L4-tree.png"
          alt="Left Cherry Blossom Tree"
          width={1920}
          height={1000}
          className="h-40 w-full sm:h-60 lg:h-120 object-cover opacity-60 sm:opacity-70 lg:opacity-80"
        />
      </div>

      {/* Right Side Cherry Blossom Tree */}
      <div className="fixed right-0 top-80 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/R2-tree.png"
          alt="Right Cherry Blossom Tree"
          width={1920}
          height={1024}
          className="h-24 w-40 sm:h-60 sm:w-80 lg:h-95 lg:w-164 object-cover opacity-50 sm:opacity-55 lg:opacity-60"
        />
      </div>
    </>
  );
}
