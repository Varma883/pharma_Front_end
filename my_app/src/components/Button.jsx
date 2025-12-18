// src/components/Button.jsx
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-teal-700", // using updated primary color logic or tailwind utility
        secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-2 border-primary text-primary hover:bg-blue-50"
    };

    // Create a safe variant fallback
    const variantClass = variants[variant] || variants.primary;

    return (
        <button className={`${baseStyle} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};
