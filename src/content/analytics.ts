// Analytics configuration - GTM-only approach
// Replace the placeholder IDs below with your actual tracking IDs
const analytics = {
  tagManagerId: "GTM-XXXXXXX", // Replace with your Google Tag Manager container ID (e.g., "GTM-ABC123")
  clarityId: "CLARITY-XXXXXXX", // Replace with your Microsoft Clarity project ID (e.g., "abcd1234")
  // Note: Google Analytics is configured within GTM
  // This provides better performance and management flexibility
  isTrackingEnabled: false, // Set to true when you've added your real tracking IDs
};

export default analytics;
