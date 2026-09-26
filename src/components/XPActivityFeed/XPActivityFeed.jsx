import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Gamepad2,
  Flame,
  CheckCircle,
  Users,
  Crown,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Inbox
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './XPActivityFeed.module.css';

export default function XPActivityFeed() {
  const { activityLedger } = useRewards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredActivities = useMemo(() => {
    return activityLedger.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [activityLedger, searchQuery, selectedCategory]);

  const renderIcon = (type) => {
    switch (type) {
      case 'Gamepad2':
        return <Gamepad2 size={18} color="#38bdf8" />;
      case 'Flame':
        return <Flame size={18} color="#f59e0b" />;
      case 'Users':
        return <Users size={18} color="#a78bfa" />;
      case 'Crown':
        return <Crown size={18} color="#fbbf24" />;
      case 'BookOpen':
        return <BookOpen size={18} color="#38bdf8" />;
      case 'ShieldCheck':
        return <ShieldCheck size={18} color="#34d399" />;
      default:
        return <Sparkles size={18} color="#f59e0b" />;
    }
  };

  return (
    <section id="activity-feed" className={styles.activitySection} aria-label="XP Activity Ledger">
      <div className="container">
        <div className={styles.sectionCard}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div className={styles.titleArea}>
              <span className={styles.subHeading}>Transaction Audit</span>
              <h2 className={styles.mainHeading}>Recent XP Activity</h2>
            </div>

            <div className={styles.filterControls}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Filter activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search activities"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
                aria-label="Filter category"
              >
                <option value="All">All Categories</option>
                <option value="Game">Games</option>
                <option value="Streak">Streaks</option>
                <option value="Daily Task">Tasks</option>
                <option value="Referral">Referrals</option>
                <option value="Milestone">Milestones</option>
              </select>
            </div>
          </div>

          {/* Activity Ledger List */}
          {filteredActivities.length > 0 ? (
            <div className={styles.activityList}>
              {filteredActivities.map((entry) => (
                <div key={entry.id} className={styles.activityItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIcon}>
                      {renderIcon(entry.iconType)}
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemTitle}>{entry.title}</h3>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemCategoryTag}>{entry.category}</span>
                        <span>•</span>
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemRight}>
                    <span className={styles.xpDelta}>
                      +{entry.xpDelta} XP
                    </span>
                    <span className={`${styles.statusBadge} badge-green`}>
                      {entry.status || 'Verified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Inbox size={28} />
              </div>
              <h4 className={styles.emptyTitle}>No matching transactions found</h4>
              <p className={styles.emptyText}>
                No activity matches your filter criteria "{searchQuery || selectedCategory}". Reset filters or complete games and tasks to generate activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
