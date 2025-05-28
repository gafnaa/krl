"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, MapPin, Train, Calendar } from "lucide-react";
import trainScheduleData from "../data/trainSchedule.json";

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
  const [departureTimeInput, setDepartureTimeInput] = useState<string>(""); // Initialize as empty string
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<Date | null>(null);
  const [selectedTrainInstanceTimes, setSelectedTrainInstanceTimes] = useState<string[]>([]);

  // Initialize currentTime on the client side
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    if (currentStation === "Belum Berangkat") return "text-orange-600";
    if (isCompleted) return "text-green-600";
    return "text-blue-600";
  };

  const getProgressColor = () => {
    if (currentStation === "Belum Berangkat") return "bg-orange-500";
    if (isCompleted) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Train className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            KRL Tracker
          </h1>
          <p className="text-gray-600">Pantau posisi kereta real-time</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Current Time */}
          <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-xl">
            <Clock className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-lg font-semibold text-gray-800">
              {formatTime(currentTime)} WIB
            </span>
          </div>

          {/* Route Selection */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              Rute Perjalanan
            </label>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {trainScheduleData.routes.map((route) => (
                <button
                  key={route.direction}
                  onClick={() => setSelectedRouteDirection(route.direction)}
                  className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200 ${
                    selectedRouteDirection === route.direction
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {route.direction}
                </button>
              ))}
            </div>
          </div>

          {/* Departure Time Input */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              Waktu Keberangkatan dari{" "}
              {currentRouteSchedule?.stations[0]?.station || "Stasiun Awal"}
            </label>
            <select
              value={departureTimeInput}
              onChange={(e) => setDepartureTimeInput(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg font-semibold text-center focus:border-blue-500 focus:outline-none transition-colors bg-white appearance-none"
            >
              {currentRouteSchedule?.stations[0]?.departure_times?.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Current Status */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Status Perjalanan
            </p>
            <div className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
              {currentStation}
            </div>
            {nextStation && timeToNext && timeToNext > 0 && (
              <p className="text-sm text-gray-600">
                Menuju {nextStation} dalam {formatDuration(timeToNext)}
              </p>
            )}
            {currentStation === "Belum Berangkat" && nextStation && timeToNext && (
              <p className="text-sm text-gray-600">
                Keberangkatan menuju {nextStation} dalam {formatDuration(timeToNext)}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progres Perjalanan</span>
              <span className="text-sm font-semibold text-gray-700">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Station List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Daftar Stasiun
          </h3>
          <div className="space-y-3">
            {currentRouteSchedule?.stations.map((station, index) => {
              const stationTime = selectedTrainInstanceTimes[index];
              const isCurrentStation = currentStation === station.station;
              const isPassed =
                currentRouteSchedule.stations.findIndex(
                  (s) => s.station === currentStation
                ) > index;

              return (
                <div
                  key={station.station}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    isCurrentStation
                      ? "bg-blue-100 border-2 border-blue-300 shadow-md"
                      : isPassed
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        isCurrentStation
                          ? "bg-blue-600 animate-pulse"
                          : isPassed
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        isCurrentStation
                          ? "text-blue-800 font-bold"
                          : isPassed
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      {station.station}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-mono ${
                      isCurrentStation
                        ? "text-blue-700 font-semibold"
                        : isPassed
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stationTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Data jadwal bersifat estimasi dan dapat berubah sewaktu-waktu</p>
        </div>
      </div>
    </div>
  );
}
