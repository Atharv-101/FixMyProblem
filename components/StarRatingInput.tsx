import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  rating: number;
  setRating: (r: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                >
                    <Star className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;
