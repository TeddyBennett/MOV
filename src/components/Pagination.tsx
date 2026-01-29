import React, { useState, useEffect } from 'react';
import styles from '../styles/pagination.module.css';
import { capTotalPages } from '../utils/paginationUtils';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, handlePageChange }) => {
    const [pagesToShow, setPagesToShow] = useState<(number | string)[]>([]);

    const cappedTotalPages = capTotalPages(totalPages);
    
    useEffect(() => {
        const getPagesToShow = () => {
            const pageNumbers: (number | string)[] = [];
            const pageRange = 5; // Number of pages around the current page
            const start = Math.max(2, currentPage - Math.floor(pageRange / 2)); // Start from page 2
            const end = Math.min(cappedTotalPages - 1, currentPage + Math.floor(pageRange / 2)); // Avoid last page

            // Always show the first page
            pageNumbers.push(1);

            // Add ellipsis if there's a gap
            if (start > 2) pageNumbers.push("...");

            // Add the middle range of pages
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < cappedTotalPages - 1) pageNumbers.push("...");

            // Always show the last page
            if (cappedTotalPages > 1) {
                pageNumbers.push(cappedTotalPages);
            }

            setPagesToShow(pageNumbers);
        };

        getPagesToShow();
    }, [currentPage, cappedTotalPages]);

    return (
        <div className={styles["pagination"]}>
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                &lt;
            </button>

            {/* Page Numbers */}
            {pagesToShow.map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (typeof page === 'number') handlePageChange(page);
                    }}
                    disabled={page === "..."}
                    className={page === currentPage ? styles["active"] : ""}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= cappedTotalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
