
import { useNavigate } from "react-router-dom";
import { DevicePhoneMobileIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

const GatewayPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-oppr-gray-50 to-oppr-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <div className="w-16 h-16 bg-oppr-blue rounded-lg mx-auto mb-4 flex items-center justify-center transform rotate-3">
              <div className="w-8 h-8 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oppr Training</h1>
            <p className="text-gray-600">Interactive Training for the Modern Workforce</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/mobile/login')}
            className="w-full oppr-card p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-oppr-blue/10 rounded-lg flex items-center justify-center group-hover:bg-oppr-blue/20 transition-colors">
                <DevicePhoneMobileIcon className="w-6 h-6 text-oppr-blue" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Enter Mobile Experience
                </h3>
                <p className="text-sm text-gray-600">
                  For taking trainings & operator view
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/desktop/login')}
            className="w-full oppr-card p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-oppr-blue/10 rounded-lg flex items-center justify-center group-hover:bg-oppr-blue/20 transition-colors">
                <ComputerDesktopIcon className="w-6 h-6 text-oppr-blue" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Enter Desktop Experience
                </h3>
                <p className="text-sm text-gray-600">
                  For managers, authoring & administration
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-gray-500">© 2024 Oppr Training. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default GatewayPage;
