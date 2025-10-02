'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { ScheduleRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/loading-spinner';

const ProfileHistoryPage = () => {
  const [schedules, setSchedules] = useState<ScheduleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getSchedules();
        if (response.status === 200 && response.data) {
          setSchedules(response.data);
        } else {
          setError(response.message || 'Failed to fetch schedules.');
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('An error occurred while fetching schedules.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Schedule History</h1>
      {schedules.length === 0 ? (
        <p className="text-center text-gray-500">No schedules found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Schedule on {schedule.preferredDate} at {schedule.preferredTime}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Pincode: {schedule.pincode}</p>
                <p className="text-sm text-gray-600 mb-2">Address: {schedule.existingAddress ? 'Existing Address' : 'New Address (ID: ' + schedule.addressId + ')'}</p>
                {schedule.alternateMobileNo && (
                  <p className="text-sm text-gray-600 mb-2">Alternate Mobile: {schedule.alternateMobileNo}</p>
                )}
                {schedule.additionalNotes && (
                  <p className="text-sm text-gray-600 mb-2">Notes: {schedule.additionalNotes}</p>
                )}
                {schedule.userPrice && (
                  <p className="text-sm text-gray-600 mb-2">User Price: ₹{schedule.userPrice}</p>
                )}
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-2">Items:</h3>
                {schedule.items.length === 0 ? (
                  <p className="text-sm text-gray-500">No items in this schedule.</p>
                ) : (
                  <ul>
                    {schedule.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-700 mb-1">
                        - {item.quantity}x {item.product} ({item.category}) - Condition: {item.condition}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHistoryPage;
