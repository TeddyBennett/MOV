import React, { useState } from 'react';
import { useDataContext } from '../data/DataContext';
import { useCustomToast } from '../hooks/useCustomToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/Button';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose }) => {
    const [listName, setListName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { movieDataOperations } = useDataContext();
    const { showCustomToast } = useCustomToast();

    const handleCreate = async () => {
        if (!listName.trim()) return;

        try {
            setIsSubmitting(true);
            const success = await movieDataOperations.createList(listName);
            if (success) {
                showCustomToast("List Created", `"${listName}" has been added to your collections.`, "success", "CUSTOM LISTS");
                setListName('');
                onClose();
            }
        } catch (error) {
            console.error("Failed to create list:", error);
            showCustomToast("Error", "Could not create list. Please try again.", "destructive", "CUSTOM LISTS");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New List</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Organize your movies by creating a custom collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <input
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Weekend Favorites, Horror Classics"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        disabled={isSubmitting}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 border-none px-8"
                        onClick={handleCreate}
                        disabled={isSubmitting || !listName.trim()}
                    >
                        {isSubmitting ? "Creating..." : "Create List"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateListModal;
