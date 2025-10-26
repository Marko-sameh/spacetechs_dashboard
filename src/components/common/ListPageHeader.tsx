import React from 'react';
import { Button } from '../ui';

interface FilterOption {
  value: string;
  label: string;
}

interface ListPageHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filter1: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
  };
  filter2?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
  };
  onAddClick: () => void;
  addButtonText: string;
}

export const ListPageHeader: React.FC<ListPageHeaderProps> = ({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filter1,
  filter2,
  onAddClick,
  addButtonText
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <Button
          onClick={onAddClick}
        >
          {addButtonText}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 dark:text-white">
        <label className="sr-only" htmlFor="search-input">Search</label>
        <input
          id="search-input"
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="sr-only" htmlFor="filter1-select">{filter1.placeholder}</label>
        <select
          id="filter1-select"
          value={filter1.value}
          onChange={(e) => filter1.onChange(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={filter1.placeholder}
        >
          <option value="">{filter1.placeholder}</option>
          {filter1.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {filter2&& (
          <>
            <label className="sr-only" htmlFor="filter2-select">{filter2.placeholder}</label>
            <select
              id="filter2-select"
              value={filter2.value}
              onChange={(e) => filter2.onChange(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={filter2.placeholder}
            >
          <option value="">{filter2.placeholder}</option>
          {filter2.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};