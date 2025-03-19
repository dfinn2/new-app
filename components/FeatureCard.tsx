import React from 'react';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface FeatureCardProps {
  containerColor: string;
  lineColor: string;
  iconName: IconName;
  title: string;
  description: string;
  personImage: string;
  personAlt: string;
  iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  containerColor,
  lineColor,
  iconName,
  title,
  description,
  personImage,
  personAlt,
  iconPosition = 'top-right'
}) => {
  
const Icon = LucideIcons[iconName] as React.ElementType;

const getIconStyles = () => {
    switch (iconPosition) {
      case 'top-left':
        return {
          icon: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
          line: 'top-0 left-0 w-[30px] h-[30px] border-l-2 border-t-2 rounded-tl-lg'
        };
      case 'top-right':
        return {
          icon: 'top-0 right-0 translate-x-1/2',
          line: 'top-0 right-0 w-[30px] h-[30px] border-r-2 border-t-2 rounded-tr-lg'
        };
      case 'bottom-left':
        return {
          icon: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
          line: 'bottom-0 left-0 w-[30px] h-[30px] border-l-2 border-b-2 rounded-bl-lg'
        };
      case 'bottom-right':
        return {
          icon: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
          line: 'bottom-0 right-0 w-[30px] h-[30px] border-r-2 border-b-2 rounded-br-lg'
        };
      default:
        return {
          icon: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
          line: 'top-0 right-0 w-[30px] h-[30px] border-r-2 border-t-2 rounded-tr-lg'
        };
    }
  };

  const { icon: iconStyles, line: lineStyles } = getIconStyles();

 
  return (
    <div className="relative w-full max-w-md mx-auto my-12">
      {/* Main container */}
      <div 
        className="relative p-6 rounded-xl overflow-visible z-10"
        style={{ backgroundColor: containerColor }}
      >
        {/* Content area */}
        <div className="min-h-[180px]">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>

        {/* Angled text box at the bottom */}
        <div className="absolute bottom-2 left-5 transform translate-y-1/2 -rotate-3 bg-highlight-300 px-6 py-2 rounded-sm shadow-md z-20">
          <p className="font-bold text-sm">Read more</p>
        </div>
      </div>

      {/* Person image that breaks the grid */}
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 z-20">
        <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden ">
          <Image
            src={personImage}
            alt={personAlt}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Icon with connecting line */}
      <div className={`absolute ${iconStyles} z-30`}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md">
          <Icon size={24} />
        </div>
      </div>

      {/* Connecting line */}
      <div 
        className={`absolute ${lineStyles} z-20`}
        style={{ borderColor: lineColor }}
      ></div>
    </div>
  );
};

export default FeatureCard;