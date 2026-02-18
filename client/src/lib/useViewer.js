import useStore from '../store/useStore';

/**
 * useViewer — returns true when the logged-in user is a read-only viewer (TEST101).
 * Use this to conditionally hide/disable all write actions.
 *
 * Usage:
 *   const isViewer = useViewer();
 *   {!isViewer && <button>Add</button>}
 */
const useViewer = () => {
    const role = useStore((state) => state.role);
    return role === 'viewer';
};

export default useViewer;
