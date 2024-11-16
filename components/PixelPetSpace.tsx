"use client";

import React, { useState, useEffect } from "react";

interface SpriteSheetConfig {
  path: string;
  width: number;
  height: number;
  framesPerRow: number;
  frameWidth: number;
  frameHeight: number;
  spriteOffsetX: number;
  spriteOffsetY: number;
  spriteSize: number;
  scaleFactor: number;
  frameCount: number;
  hasDirections: boolean;
}

type SpriteType =
  | "rabbit-normal"
  | "rabbit-horn"
  | "pig-move"
  | "piggy-move"
  | "boar-move";

interface Pet {
  id: number;
  x: number;
  y: number;
  direction: { x: number; y: number };
  frame: number;
  facingDirection: "down" | "left" | "right" | "up";
  spriteSheetType: SpriteType;
}

interface PetConfig {
  type: SpriteType;
  count: number;
}

interface PixelPetSpaceProps {
  petConfigs: PetConfig[];
  spaceSize?: number;
}

const PixelPetSpace: React.FC<PixelPetSpaceProps> = ({
  petConfigs,
  spaceSize = 400,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const changeDirectionChance = 0.02;

  // Updated sprite sheet configurations
  const spriteSheetConfigs: Record<SpriteType, SpriteSheetConfig> = {
    "rabbit-normal": {
      path: "/sprites/rabbit-move.png",
      width: 768,
      height: 512,
      framesPerRow: 6,
      frameWidth: 128,
      frameHeight: 128,
      spriteOffsetX: 50,
      spriteOffsetY: 57,
      spriteSize: 28,
      scaleFactor: 2,
      frameCount: 6,
      hasDirections: true,
    },
    "rabbit-horn": {
      path: "/sprites/rabbit-horn-move.png",
      width: 768,
      height: 512,
      framesPerRow: 6,
      frameWidth: 128,
      frameHeight: 128,
      spriteOffsetX: 50,
      spriteOffsetY: 57,
      spriteSize: 28,
      scaleFactor: 2,
      frameCount: 6,
      hasDirections: true,
    },
    "pig-move": {
      path: "/sprites/pig-move.png",
      width: 768,
      height: 512,
      framesPerRow: 6,
      frameWidth: 128,
      frameHeight: 128,
      spriteOffsetX: 46,
      spriteOffsetY: 53,
      spriteSize: 36,
      scaleFactor: 2,
      frameCount: 6,
      hasDirections: true,
    },
    "piggy-move": {
      path: "/sprites/piggy-move.png",
      width: 768,
      height: 512,
      framesPerRow: 6,
      frameWidth: 128,
      frameHeight: 128,
      spriteOffsetX: 52,
      spriteOffsetY: 62,
      spriteSize: 22,
      scaleFactor: 2,
      frameCount: 6,
      hasDirections: true,
    },
    "boar-move": {
      path: "/sprites/boar-move.png",
      width: 768,
      height: 512,
      framesPerRow: 6,
      frameWidth: 128,
      frameHeight: 128,
      spriteOffsetX: 44,
      spriteOffsetY: 50,
      spriteSize: 40,
      scaleFactor: 2,
      frameCount: 6,
      hasDirections: true,
    },
  };

  const getRandomDirection = () => {
    const angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  };

  useEffect(() => {
    let id = 0;
    const initialPets: Pet[] = petConfigs.flatMap((config) => {
      const { spriteSize, scaleFactor } = spriteSheetConfigs[config.type];
      const petSize = spriteSize * scaleFactor;
      return Array.from(
        { length: config.count },
        (): Pet => ({
          id: id++,
          x: Math.random() * (spaceSize - petSize),
          y: Math.random() * (spaceSize - petSize),
          direction: getRandomDirection(),
          frame: 0,
          facingDirection: "down" as const,
          spriteSheetType: config.type,
        })
      );
    });
    setPets(initialPets);
  }, [petConfigs, spaceSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPets((prevPets) =>
        prevPets.map((pet) => {
          let newDirection = pet.direction;

          // Random direction change
          if (Math.random() < changeDirectionChance) {
            newDirection = getRandomDirection();
          }

          let newX = pet.x + newDirection.x;
          let newY = pet.y + newDirection.y;

          // Boundary checks
          const { spriteSize, scaleFactor, frameCount } =
            spriteSheetConfigs[pet.spriteSheetType];
          const petSize = spriteSize * scaleFactor;

          if (newX <= 0 || newX >= spaceSize - petSize) {
            newDirection.x *= -1;
            newX = Math.max(0, Math.min(newX, spaceSize - petSize));
          }
          if (newY <= 0 || newY >= spaceSize - petSize) {
            newDirection.y *= -1;
            newY = Math.max(0, Math.min(newY, spaceSize - petSize));
          }

          const newFrame =
            (pet.frame + 1) %
            spriteSheetConfigs[pet.spriteSheetType].frameCount;

          // Determine facing direction based on movement only if the sprite has directions
          let facingDirection: Pet["facingDirection"] = pet.facingDirection;
          if (spriteSheetConfigs[pet.spriteSheetType].hasDirections) {
            if (Math.abs(newDirection.x) > Math.abs(newDirection.y)) {
              facingDirection = newDirection.x > 0 ? "right" : "left";
            } else {
              facingDirection = newDirection.y > 0 ? "down" : "up";
            }
          }

          return {
            ...pet,
            x: newX,
            y: newY,
            frame: newFrame,
            facingDirection,
            direction: newDirection,
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [spaceSize]);

  return (
    <div
      className="relative bg-green-300"
      style={{ width: spaceSize, height: spaceSize }}
    >
      {pets.map((pet) => (
        <PixelPet
          key={pet.id}
          pet={pet}
          spriteSheetConfig={spriteSheetConfigs[pet.spriteSheetType]}
        />
      ))}
    </div>
  );
};

interface PixelPetProps {
  pet: Pet;
  spriteSheetConfig: SpriteSheetConfig;
}

const PixelPet: React.FC<PixelPetProps> = ({ pet, spriteSheetConfig }) => {
  const directionRow = spriteSheetConfig.hasDirections
    ? {
        down: 0,
        left: 1,
        right: 2,
        up: 3,
      }[pet.facingDirection]
    : 0;

  const {
    spriteSize,
    scaleFactor,
    frameWidth,
    frameHeight,
    spriteOffsetX,
    spriteOffsetY,
  } = spriteSheetConfig;
  const petSize = spriteSize * scaleFactor;

  const spriteX =
    (pet.frame % spriteSheetConfig.framesPerRow) * frameWidth + spriteOffsetX;
  const spriteY = directionRow * frameHeight + spriteOffsetY;

  return (
    <div
      className="absolute"
      style={{
        left: pet.x,
        top: pet.y,
        width: petSize,
        height: petSize,
        backgroundImage: `url('${spriteSheetConfig.path}')`,
        backgroundPosition: `-${spriteX * scaleFactor}px -${
          spriteY * scaleFactor
        }px`,
        backgroundSize: `${spriteSheetConfig.width * scaleFactor}px ${
          spriteSheetConfig.height * scaleFactor
        }px`,
        imageRendering: "pixelated",
      }}
    />
  );
};

export default PixelPetSpace;
