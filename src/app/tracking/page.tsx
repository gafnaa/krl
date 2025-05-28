"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, MapPin, Train, Calendar, Sun, Moon } from "lucide-react";
import trainScheduleData from "../../data/trainSchedule.json"; // Adjusted path

interface TrainStation {
  station: string;
  departure_times?: string[];
  arrival_times?: string[];
}

interface Route {
  direction: string;
  stations: TrainStation[];
}

export default function KRLTracker() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedRouteDirection, setSelectedRouteDirection] = useState<string>("Jogja-Palur");
  const [departureTimeInput, setDepartureTimeInput] = useState<string>("");
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<Date | null>(null);
  const [selectedTrainInstanceTimes, setSelectedTrainInstanceTimes] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize dark mode from local storage or default to false
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true';
    }
    return false;
  });

  // Initialize currentTime on the client side
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save dark mode preference to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const currentRouteSchedule = useMemo(() => {
    return trainScheduleData.routes.find(
      (route) => route.direction === selectedRouteDirection
    );
  }, [selectedRouteDirection]);

  useEffect(() => {
    if (!currentRouteSchedule || currentRouteSchedule.stations.length === 0) {
      setSelectedDepartureTime(null);
      setSelectedTrainInstanceTimes([]);
      return;
    }

    const firstStation = currentRouteSchedule.stations[0];
    const times = firstStation.departure_times || firstStation.arrival_times || [];
    
    // Find the index of the selected departure time in the first station's times
    // Initialize departureTimeInput based on the selected route and its first available time
    if (departureTimeInput === "" && times.length > 0) {
      setDepartureTimeInput(times[0]);
    }

    const selectedTimeIndex = times.indexOf(departureTimeInput);

    if (selectedTimeIndex === -1 && times.length > 0) {
      // If the input time is not found (e.g., after route change), default to the first available time
      setDepartureTimeInput(times[0]);
      setSelectedTrainInstanceTimes(
        currentRouteSchedule.stations.map(
          (s) => (s.departure_times || s.arrival_times)?.[0] || ""
        )
      );
    } else if (selectedTimeIndex !== -1) {
      // Set the times for the selected train instance across all stations
      setSelectedTrainInstanceTimes(
        currentRouteSchedule.stations.map(
          (s) => (s.departure_times || s.arrival_times)?.[selectedTimeIndex] || ""
        )
      );
    } else {
      // No times available or other edge case
      setSelectedTrainInstanceTimes([]);
    }

    const [hours, minutes] = departureTimeInput.split(":").map(Number);
    const now = new Date();
    const depTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    if (depTime.getTime() < now.getTime()) {
      depTime.setDate(depTime.getDate() + 1);
    }

    setSelectedDepartureTime(depTime);
  }, [departureTimeInput, currentRouteSchedule]);

  const calculateEstimatedPosition = useMemo(() => {
    if (!selectedDepartureTime || !currentRouteSchedule || selectedTrainInstanceTimes.length === 0 || !currentTime) {
      return {
        currentStation: "Belum Berangkat",
        progress: 0,
        nextStation: null,
        timeToNext: null,
        isCompleted: false,
      };
    }

    const now = currentTime; // currentTime is guaranteed to be Date here
    const timeDiff = now.getTime() - selectedDepartureTime.getTime();

    if (timeDiff < 0) {
      return {
        currentStation: "Belum Berangkat",
        progress: 0,
        nextStation: currentRouteSchedule.stations[0]?.station || null,
        timeToNext: Math.abs(timeDiff),
        isCompleted: false,
      };
    }

    let currentStation = currentRouteSchedule.stations[0]?.station || "Unknown";
    let progress = 0;
    let nextStation = null;
    let timeToNext = null;
    let isCompleted = false;

    for (let i = 0; i < currentRouteSchedule.stations.length; i++) {
      const station = currentRouteSchedule.stations[i];
      const scheduledTimeStr = selectedTrainInstanceTimes[i];
      if (!scheduledTimeStr) continue;

      const [schHours, schMinutes] = scheduledTimeStr.split(":").map(Number);

      const scheduledStationTime = new Date(
        selectedDepartureTime.getFullYear(),
        selectedDepartureTime.getMonth(),
        selectedDepartureTime.getDate(),
        schHours,
        schMinutes,
        0
      );

      if (now.getTime() >= scheduledStationTime.getTime()) {
        currentStation = station.station;
        progress = ((i + 1) / currentRouteSchedule.stations.length) * 100;

        if (i < currentRouteSchedule.stations.length - 1) {
          const nextStationInfo = currentRouteSchedule.stations[i + 1];
          const nextScheduledTimeStr = selectedTrainInstanceTimes[i + 1];
          if (nextScheduledTimeStr) {
            const [nextHours, nextMinutes] = nextScheduledTimeStr.split(":").map(Number);
            const nextStationTime = new Date(
              selectedDepartureTime.getFullYear(),
              selectedDepartureTime.getMonth(),
              selectedDepartureTime.getDate(),
              nextHours,
              nextMinutes,
              0
            );

            nextStation = nextStationInfo.station;
            timeToNext = nextStationTime.getTime() - now.getTime();

            if (timeToNext > 0) {
              const stationDuration = nextStationTime.getTime() - scheduledStationTime.getTime();
              const elapsed = now.getTime() - scheduledStationTime.getTime();
              const stationProgress = Math.min(1, elapsed / stationDuration);
              progress = ((i + stationProgress) / currentRouteSchedule.stations.length) * 100;
            }
          }
        } else {
          isCompleted = true;
          progress = 100;
        }
      } else {
        break;
      }
    }

    return {
      currentStation,
      progress: Math.min(100, Math.max(0, progress)),
      nextStation,
      timeToNext,
      isCompleted,
    };
  }, [currentTime, selectedDepartureTime, currentRouteSchedule, selectedTrainInstanceTimes]);

  const { currentStation, progress, nextStation, timeToNext, isCompleted } = calculateEstimatedPosition;

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--:--"; // Placeholder for when date is null
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = () => {
    if (currentStation === "Belum Berangkat") return "text-orange-600 dark:text-orange-400";
    if (isCompleted) return "text-green-600 dark:text-green-400";
    return "text-blue-600 dark:text-blue-400";
  };

  const getProgressColor = () => {
    if (currentStation === "Belum Berangkat") return "bg-orange-500 dark:bg-orange-400";
    if (isCompleted) return "bg-green-500 dark:bg-green-400";
    return "bg-blue-500 dark:bg-blue-400";
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-10 relative">
          {/* Dark mode toggle button is now in Navbar */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mb-6 transform hover:scale-105 transition-transform shadow-lg">
            <Train className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-3 dark:from-blue-300 dark:to-blue-500">
            KRL Tracker
          </h1>
          <p className="text-gray-600 text-lg dark:text-gray-400">Pantau perjalanan kereta secara real-time</p>
        </div>

        {/* Main Card with enhanced shadows and gradients */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          {/* Current Time with glass effect */}
          <div className="flex items-center justify-center mb-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl backdrop-blur-sm dark:from-gray-700 dark:to-gray-700">
            <Clock className="w-6 h-6 text-blue-600 mr-3 dark:text-blue-300" />
            <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {formatTime(currentTime)} WIB
            </span>
          </div>

          {/* Route Selection with enhanced buttons */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-4 dark:text-gray-300">
              <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
              Rute Perjalanan
            </label>
            <div className="flex bg-gray-50 rounded-2xl p-2 dark:bg-gray-700">
              {trainScheduleData.routes.map((route) => (
                <button
                  key={route.direction}
                  onClick={() => setSelectedRouteDirection(route.direction)}
                  className={`flex-1 py-4 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                    selectedRouteDirection === route.direction
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {route.direction}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Departure Time Input */}
          <div className="mb-10">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-4 dark:text-gray-300">
              <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
              Waktu Keberangkatan
            </label>
            <select
              value={departureTimeInput}
              onChange={(e) => setDepartureTimeInput(e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl text-lg font-semibold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white appearance-none hover:border-blue-400 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:focus:border-blue-400 dark:hover:border-blue-300"
            >
              {currentRouteSchedule?.stations[0]?.departure_times?.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Enhanced Status Display */}
          <div className="text-center mb-10 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700">
            <p className="text-sm font-medium text-gray-600 mb-3 dark:text-gray-400">
              Status Perjalanan
            </p>
            <div className={`text-3xl font-bold mb-3 ${getStatusColor()}`}>
              {currentStation}
            </div>
            {nextStation && timeToNext && timeToNext > 0 && (
              <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full inline-block shadow-sm dark:bg-gray-800 dark:text-gray-300">
                Menuju {nextStation} dalam {formatDuration(timeToNext)}
              </p>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progres Perjalanan</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden shadow-inner dark:bg-gray-700">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${getProgressColor()} bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Station List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center dark:text-gray-200">
            <MapPin className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-300" />
            Daftar Stasiun
          </h3>
          <div className="space-y-4">
            {currentRouteSchedule?.stations.map((station, index) => {
              const stationTime = selectedTrainInstanceTimes[index];
              const isCurrentStation = currentStation === station.station;
              const isPassed = currentRouteSchedule.stations.findIndex(
                (s) => s.station === currentStation
              ) > index;

              return (
                <div
                  key={station.station}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    isCurrentStation
                      ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-lg dark:from-blue-800 dark:to-blue-700 dark:border-blue-600"
                      : isPassed
                      ? "bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700"
                      : "bg-gray-50 border border-gray-200 hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-4 ${
                        isCurrentStation
                          ? "bg-blue-600 animate-pulse ring-4 ring-blue-200 dark:bg-blue-400 dark:ring-blue-600"
                          : isPassed
                          ? "bg-green-500 dark:bg-green-400"
                          : "bg-gray-300 dark:bg-gray-500"
                      }`}
                    ></div>
                    <span className={`font-medium ${
                      isCurrentStation
                        ? "text-blue-800 font-bold text-lg dark:text-blue-200"
                        : isPassed
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}>
                      {station.station}
                    </span>
                  </div>
                  <span className={`text-sm font-mono px-4 py-2 rounded-lg ${
                    isCurrentStation
                      ? "bg-blue-100 text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-300"
                      : isPassed
                      ? "bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  }`}>
                    {stationTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm bg-white rounded-2xl p-4 shadow-md dark:bg-gray-800 dark:text-gray-400">
          <p>Data jadwal bersifat estimasi dan dapat berubah sewaktu-waktu</p>
        </div>
      </div>
    </div>
  );
}
