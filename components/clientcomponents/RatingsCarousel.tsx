import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"

interface Comment {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  image: any;
}

const comments: Comment[] = [
  {
    image: require("@/public/images/profile_1.jpg"),
    name: "Alex Smith",
    initials: "AS",
    rating: 4,
    comment:
      "I've been using this product for a few weeks now and I'm really impressed with the quality and performance.",
  },
  {
    image: require("@/public/images/profile_2.jpg"),
    name: "Sarah Johnson",
    initials: "SJ",
    rating: 5,
    comment:
      "I love how easy it is to use this product. The interface is intuitive and the features are exactly what I need. Highly recommended!",
  },
  {
    image: require("@/public/images/profile_3.jpg"),
    name: "Emily Parker",
    initials: "EP",
    rating: 3,
    comment:
      "I was a bit hesitant at first, but this product has exceeded my expectations. The customer support has also been fantastic.",
  },
  {
    image: require("@/public/images/profile_4.jpg"),
    name: "Michael Johnson",
    initials: "MJ",
    rating: 5,
    comment:
      "I'm really impressed with the overall quality and functionality of this product. It's been a game-changer for my business.",
  },
  {
    image: require("@/public/images/profile_5.jpg"),
    name: "Emily Wilson",
    initials: "EW",
    rating: 4,
    comment:
      "I'm really happy with my purchase. The product is exactly what I needed and the customer service has been fantastic.",
  },
];

export default function RatingsCarousel() {
  return (
    <div className=" w-full px-4 md:px-6 py-6">
      <Carousel
        className=" snap-x snap-mandatory overflow-x-auto scrollbar-hide relative"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction:false,
          }),
        ]}
        
      >
        <CarouselContent className="flex gap-4">
          {comments.map((comment, index) => (
            <CarouselItem
              key={index}
              className="snap-center w-[10px] shrink-0"
            >
              <Card className="p-6 flex flex-col gap-4 rounded-lg shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-48 h-48 border rounded-full overflow-hidden">
                    <Image
                      src={comment.image}
                      alt={comment.name}
                      width={192} // Match the width and height to your Avatar dimensions
                      height={192}
                      className="object-cover"
                    />
                  </Avatar>

                  <div className="flex items-center gap-1">
                    {[...Array(5).keys()].map((i) => (
                      <StarIcon
                        key={i}
                        className={`stroke-none w-5 h-5 ${
                          i < comment.rating
                            ? "fill-[#FFD700]"
                            : "fill-muted-foreground "
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="leading-relaxed text-center">
                  {comment.comment}
                </div>
                <div className="text-center mt-2">
                  <p className="text-muted-foreground font-semibold">
                    ~ {comment.name}
                  </p>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:left-4  p-2 rounded-full shadow-md" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 md:right-4  p-2 rounded-full shadow-md" />
      </Carousel>
    </div>
  );
}

interface IconProps {
  className?: string;
}

function StarIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
