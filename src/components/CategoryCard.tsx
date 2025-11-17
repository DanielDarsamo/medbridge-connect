import { Card } from '@/components/ui/card';
import { Category } from '@/types/phrase';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-primary bg-card"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-5xl mb-2">{category.icon}</div>
        <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
        <p className="text-sm text-muted-foreground">
          {category.phraseCount} phrases
        </p>
      </div>
    </Card>
  );
};
