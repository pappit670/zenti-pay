import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, TrendingUp, Users, Award, MessageSquare } from 'lucide-react-native';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export default function BusinessReputation() {
  const router = useRouter();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('business_reviews')
      .select('*, profiles!business_reviews_customer_id_fkey(full_name)')
      .eq('business_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data as Review[]);

      const totalReviews = data.length;
      const averageRating = data.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews || 0;
      const fiveStarCount = data.filter((r: any) => r.rating === 5).length;
      const fourStarCount = data.filter((r: any) => r.rating === 4).length;
      const threeStarCount = data.filter((r: any) => r.rating === 3).length;
      const twoStarCount = data.filter((r: any) => r.rating === 2).length;
      const oneStarCount = data.filter((r: any) => r.rating === 1).length;

      setStats({
        averageRating,
        totalReviews,
        fiveStarCount,
        fourStarCount,
        threeStarCount,
        twoStarCount,
        oneStarCount,
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            color={star <= rating ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'}
            fill={star <= rating ? '#ffd700' : 'transparent'}
            size={16}
          />
        ))}
      </View>
    );
  };

  const getRatingPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>Business Reputation</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BlurView intensity={30} tint="dark" style={styles.statsCardBlur}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.05)']}
            style={styles.statsCard}
          >
            <View style={styles.ratingCircle}>
              <Text style={styles.ratingValue}>{stats.averageRating.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {renderStars(Math.round(stats.averageRating))}
              </View>
            </View>
            <Text style={styles.totalReviews}>{stats.totalReviews} reviews</Text>
          </LinearGradient>
        </BlurView>

        <View style={styles.metricsRow}>
          <BlurView intensity={25} tint="dark" style={styles.metricBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.metricCard}
            >
              <View style={styles.metricIcon}>
                <TrendingUp color="#00ff88" size={20} />
              </View>
              <Text style={styles.metricValue}>{stats.fiveStarCount}</Text>
              <Text style={styles.metricLabel}>5-Star</Text>
            </LinearGradient>
          </BlurView>

          <BlurView intensity={25} tint="dark" style={styles.metricBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.metricCard}
            >
              <View style={styles.metricIcon}>
                <Award color="#a3f542" size={20} />
              </View>
              <Text style={styles.metricValue}>
                {stats.averageRating >= 4.5 ? 'Excellent' : stats.averageRating >= 3.5 ? 'Good' : 'Average'}
              </Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </LinearGradient>
          </BlurView>
        </View>

        <Text style={styles.sectionTitle}>Rating Distribution</Text>

        <BlurView intensity={20} tint="dark" style={styles.distributionCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.distributionCard}
          >
            {[
              { stars: 5, count: stats.fiveStarCount },
              { stars: 4, count: stats.fourStarCount },
              { stars: 3, count: stats.threeStarCount },
              { stars: 2, count: stats.twoStarCount },
              { stars: 1, count: stats.oneStarCount },
            ].map(({ stars, count }) => (
              <View key={stars} style={styles.distributionRow}>
                <Text style={styles.distributionStars}>{stars}</Text>
                <Star color="#ffd700" fill="#ffd700" size={14} />
                <View style={styles.distributionBarContainer}>
                  <View
                    style={[
                      styles.distributionBar,
                      { width: `${getRatingPercentage(count)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.distributionCount}>{count}</Text>
              </View>
            ))}
          </LinearGradient>
        </BlurView>

        <Text style={styles.sectionTitle}>Recent Reviews</Text>

        {reviews.length === 0 ? (
          <BlurView intensity={20} tint="dark" style={styles.emptyStateBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.01)']}
              style={styles.emptyState}
            >
              <MessageSquare color="rgba(255, 255, 255, 0.3)" size={48} />
              <Text style={styles.emptyText}>No reviews yet</Text>
              <Text style={styles.emptySubtext}>Your first review will appear here</Text>
            </LinearGradient>
          </BlurView>
        ) : (
          reviews.map((review) => (
            <BlurView key={review.id} intensity={20} tint="dark" style={styles.reviewCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.reviewCard}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>
                      {review.profiles.full_name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.profiles.full_name}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View>{renderStars(review.rating)}</View>
                </View>
                {review.review_text && (
                  <Text style={styles.reviewText}>{review.review_text}</Text>
                )}
              </LinearGradient>
            </BlurView>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  statsCardBlur: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  statsCard: {
    padding: 32,
    alignItems: 'center',
  },
  ratingCircle: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  totalReviews: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  metricBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricCard: {
    padding: 20,
    alignItems: 'center',
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(163, 245, 66, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  distributionCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  distributionCard: {
    padding: 20,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  distributionStars: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    width: 12,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    width: 24,
    textAlign: 'right',
  },
  emptyStateBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
  },
  reviewCardBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  reviewCard: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(163, 245, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  reviewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});
