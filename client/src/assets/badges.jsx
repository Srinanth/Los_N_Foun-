import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";

const badgeUrls = {
  contributor: "https://img.icons8.com/color/48/000000/starburst-shape.png",
  helpfulFinder: "https://img.icons8.com/fluency/48/000000/medal.png",
  helpfulFinderNextLevel: "https://img.icons8.com/plasticine/48/000000/trophy.png",
  activeUser: "https://img.icons8.com/plasticine/48/000000/fire-badge.png",
};

const badgeCriteria = {
  contributor: { description: "Report at least one lost or found item." },
  helpfulFinder: { description: "Successfully help reunite more than 5 found items.", threshold: 5 },
  helpfulFinderNextLevel: { description: "Successfully help reunite more than 15 found items.", threshold: 15 },
  activeUser: { description: "Maintain consistent activity on the platform." },
};

const fakeBadgeRules = [
  badgeCriteria.contributor.description + " Earn the 'Contributor' badge upon your first report.",
  badgeCriteria.helpfulFinder.description + " You'll get the 'Helpful Finder' reward after your 6th successful reunion.",
  badgeCriteria.helpfulFinderNextLevel.description + " Reach 16 successful reunions to unlock the 'Dedicated Helper' badge.",
  badgeCriteria.activeUser.description + " Log in regularly to achieve this badge.",
];

const ProgressBar = ({ progress }) => (
  <div className="bg-gray-300 rounded-full h-1 relative overflow-hidden">
    <div
      className="bg-green-500 rounded-full h-1 absolute left-0 top-0"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default function YourBadgesSection({ isDarkMode, reportedItems, foundItems }) {
  const [showRules, setShowRules] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [progressToNext, setProgressToNext] = useState({});

  useEffect(() => {
    const badges = [];
    const progress = {};

    if (reportedItems && reportedItems.length > 0) {
      badges.push("contributor");
    }

    if (foundItems) {
      if (foundItems.length > badgeCriteria.helpfulFinder.threshold) {
        badges.push("helpfulFinder");
        if (foundItems.length < badgeCriteria.helpfulFinderNextLevel.threshold) {
          const remaining = badgeCriteria.helpfulFinderNextLevel.threshold - foundItems.length;
          progress["helpfulFinderNextLevel"] = {
            needed: remaining,
            current: foundItems.length,
            threshold: badgeCriteria.helpfulFinderNextLevel.threshold,
            description: ` ${remaining} more found result${remaining > 1 ? 's' : ''} till the next level!`,
          };
        }
      } else {
        const remaining = badgeCriteria.helpfulFinder.threshold - foundItems.length;
        if (remaining > 0) {
          progress["helpfulFinder"] = {
            needed: remaining,
            current: foundItems.length,
            threshold: badgeCriteria.helpfulFinder.threshold,
            description: ` ${remaining} more found result${remaining > 1 ? 's' : ''} till the 'Helpful Finder' badge!`,
          };
        }
      }
    }

    setEarnedBadges(badges);
    setProgressToNext(progress);
  }, [reportedItems, foundItems]);

  const handleRulesClick = () => {
    setShowRules(!showRules);
  };

  return (
    <section className="mb-12 relative">
      <div className="mb-6 flex items-center justify-end">
  <button
    onClick={handleRulesClick}
    className="focus:outline-none"
    aria-label="View badge rules"
  >
    <HelpCircle size={20} className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} cursor-pointer`} />
  </button>
</div>

      {showRules && (
        <div className={`absolute top-0 right-0 mt-8 p-4 z-10 rounded-md shadow-md text-sm w-64 ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"}`}>
          <h3 className="font-bold mb-2">How to Earn Rewards</h3>
          <ul className="list-disc pl-4">
            {fakeBadgeRules.map((rule, index) => (
              <li key={index} className="mb-1">{rule}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={`p-8 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"}`}>
        {earnedBadges.length > 0 ? (
          <div>
            <div className="flex justify-center space-x-4 mb-4">
              {earnedBadges.map((badge) => (
                <div key={badge} className="flex flex-col items-center">
                  {badgeUrls[badge] && <img src={badgeUrls[badge]} alt={badge} className="w-20 h-20 mb-1" />}
                  <span className="text-sm">{badge.charAt(0).toUpperCase() + badge.slice(1)}</span>
                </div>
              ))}
            </div>
            {Object.keys(progressToNext).length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Progress to Next Reward:</h3>
                <div className="mb-3">
                  {Object.entries(progressToNext).map(([badgeKey, progressInfo]) => (
                    <div key={badgeKey}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{badgeCriteria[badgeKey]?.description}</span>
                        <span>{progressInfo.current}/{progressInfo.threshold}</span>
                      </div>
                      <ProgressBar
                        progress={
                          progressInfo.threshold > 0
                            ? (progressInfo.current / progressInfo.threshold) * 100
                            : 0
                        }
                      />
                      <p className="text-xs mt-1 text-gray-500">{progressInfo.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-2">No badges earned yet. Start participating to earn rewards!</p>
            {progressToNext["helpfulFinder"] && (
              <div className="mt-4 text-left"> 
                <h3 className="font-semibold mb-2">Your Progress:</h3>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{badgeCriteria["helpfulFinder"]?.description}</span>
                  <span>{progressToNext["helpfulFinder"].current}/{badgeCriteria["helpfulFinder"].threshold}</span>
                </div>
                <ProgressBar
                  progress={
                    badgeCriteria["helpfulFinder"].threshold > 0
                      ? (progressToNext["helpfulFinder"].current / badgeCriteria["helpfulFinder"].threshold) * 100
                      : 0
                  }
                />
                <p className="text-xs mt-1 text-gray-500">{progressToNext["helpfulFinder"].description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}