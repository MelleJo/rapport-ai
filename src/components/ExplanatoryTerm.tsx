'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExplanatoryTermProps {
  term: string;
  context: string;
}

export default function ExplanatoryTerm({ term, context }: ExplanatoryTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [isImplemented, setIsImplemented] = useState(false);

  const fetchExplanation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/explain-term', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (!explanation) {
      setIsLoading(true);
      await fetchExplanation();
      setIsLoading(false);
    }
    setIsExplanationVisible(!isExplanationVisible);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState({});

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      isExplanationVisible &&
      buttonRef.current &&
      popupRef.current &&
      !buttonRef.current.contains(event.target as Node) &&
      !popupRef.current.contains(event.target as Node)
    ) {
      setIsExplanationVisible(false);
    }
  }, [isExplanationVisible]);

  const updatePopupPosition = () => {
    if (isExplanationVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const left = rect.left + (rect.width / 2);
      const top = rect.bottom + window.scrollY;
      
      setPopupStyle({
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`
      });
    }
  };

  useEffect(() => {
    if (isExplanationVisible) {
      updatePopupPosition();
      window.addEventListener('resize', updatePopupPosition);
      window.addEventListener('scroll', updatePopupPosition, true);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('resize', updatePopupPosition);
        window.removeEventListener('scroll', updatePopupPosition, true);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isExplanationVisible, handleClickOutside]);

  return (
    <>
      <span className="inline-block">
        <button
          ref={buttonRef}
          onClick={handleClick}
          className="inline-flex items-center gap-1 px-1 py-0.5 bg-blue-50 text-blue-700 rounded 
                   hover:bg-blue-100 transition-colors group"
        >
          <span>{term}</span>
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            isExplanationVisible ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )
          )}
        </button>
        
        {explanation && isExplanationVisible && (
          <div ref={popupRef}
               className="absolute transform -translate-x-1/2 mt-2 p-3 bg-blue-50 rounded-md max-w-prose z-10 shadow-lg"
               style={popupStyle}>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
              {!isImplemented && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const event = new CustomEvent('implementTerm', {
                      detail: { term, explanation }
                    });
                    document.dispatchEvent(event);
                    setIsImplemented(true);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md 
                           hover:bg-blue-700 transition-colors"
                >
                  Implementeer in tekst
                </button>
              )}
            </div>
          </div>
        )}
      </span>
    </>
  );
}
