import { Button } from "@/components/ui/button";

interface AvatarSelectorProps {
  title: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  isColor?: boolean;
}

export const AvatarSelector = ({
  title,
  options,
  selected,
  onChange,
  isColor = false
}: AvatarSelectorProps) => {
  // Map color values to Tailwind classes
  const getColorClass = (color: string): string => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selected === option ? 'default' : 'outline'}
            onClick={() => onChange(option)}
            className={`
              ${isColor ? 'p-0 w-8 h-8 rounded-full' : 'text-xs capitalize'} 
              ${selected === option ? 'ring-2 ring-primary' : ''}
            `}
          >
            {isColor ? (
              <div className={`w-full h-full rounded-full ${getColorClass(option)}`} />
            ) : (
              option === 'none' ? 'None' : option
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
