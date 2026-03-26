import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from '../../components/Carousel/Carousel';
import EditTripModal from '../../components/EditTripModal/EditTripModal';
import { fetchTrip, deleteTrip, type ApiTrip } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './TripDetail.css';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function TripDetail() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [trip, setTrip]                   = useState<ApiTrip | null>(null);
  const [loading, setLoading]             = useState(true);
  const [deleting, setDeleting]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen]           = useState(false);

  useEffect(() => {
    if (!id) { navigate('/'); return; }
    window.scrollTo(0, 0);
    fetchTrip(id)
      .then(({ data }) => setTrip(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!trip) return;
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      toast.success('Memory deleted.');
      navigate('/trips');
    } catch {
      toast.error('Failed to delete. Please try again.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <div className="detail-loading"><span className="auth-loading-spinner" /></div>;
  }

  if (!trip) return null;

  return (
    <div className="detail" style={{ ['--accent' as string]: trip.accent }}>
      <header className="detail_header">
        <Link to="/trips" className="detail_back">
          <span className="detail_back-arrow">←</span>
          <span className="detail_back-label">All journeys</span>
        </Link>

        <motion.div
          className="detail_title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <h1 className="detail_place">{trip.place}</h1>
          <p className="detail_region">{trip.region}</p>
        </motion.div>

        <p className="detail_dates">{trip.dates}</p>
      </header>

      <div className="detail_body">
        <div className="detail_meta">
          <motion.p
            className="detail_summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            {trip.summary}
          </motion.p>

          {(trip.tags ?? []).length > 0 && (
            <motion.div
              className="detail_tags"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              {trip.tags.map(tag => (
                <span key={tag} className="detail_tag">{tag}</span>
              ))}
            </motion.div>
          )}

          <div className="detail_actions-row">
            <button className="detail_edit-btn" onClick={() => setEditOpen(true)} aria-label="Edit this trip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            {confirmDelete ? (
              <div className="detail_delete-confirm">
                <span className="detail_delete-confirm-text">Delete?</span>
                <button className="detail_delete-yes" onClick={handleDelete} disabled={deleting}>
                  {deleting ? '…' : 'Yes'}
                </button>
                <button className="detail_delete-no" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                  No
                </button>
              </div>
            ) : (
              <button className="detail_delete-btn" onClick={() => setConfirmDelete(true)} aria-label="Delete this trip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>

        <motion.div
          className="detail_carousel-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <Carousel photos={trip.photos} />
        </motion.div>
      </div>

      <AnimatePresence>
        {editOpen && (
          <EditTripModal
            trip={trip}
            onClose={() => setEditOpen(false)}
            onUpdated={updated => { setTrip(updated); setEditOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
