import { useLocationSearch } from "@/hooks/use-weather";
import React from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { CommandSeparator } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/useFavorite";

const CitySearch = () => {
  const [searchInput, setSearchInput] = React.useState<string>("");
  // const debounceSearch = useDebounce(searchInput, 250);
  const navigate = useNavigate();
  const { data: locationNames, isLoading } = useLocationSearch(searchInput);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const {favorites}=useFavorite();

  const [open, setOpen] = React.useState(false);

  const handleSelect = (cityData: string) => {
    const [lat, lon, city, country] = cityData.split("|");

    addToHistory.mutate({
      query: searchInput,
      name: city,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${city}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        >
          <Search className="mr-2 w-4 h-4" />
          Search Cities...
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput
              placeholder="Search cities..."
              value={searchInput}
              onValueChange={setSearchInput}
            />
            <CommandList>
              {searchInput.length > 2 && !isLoading && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
             {history.length > 0 && (
                
                  <CommandGroup heading="Favorites">
                    {
                      favorites.map((city)=>{
                        return <CommandItem
                        key={`${city.lat}-${city.lon}`}
                        value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                        onSelect={handleSelect}
                      >
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>{city.name}</span>
                        {city.state && <span className="text-sm text-muted-foreground">, {city.state}</span>}
                        <span className="text-sm text-muted-foreground">, {city.country}</span>
                        
                      </CommandItem>
                      })
                    }
                  </CommandGroup>
              
              )}

              {history.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup >
                    <div className="flex items-center justify-between px-2 my-2">
                      <p className="m-0 text-sm text-muted-foreground">Recent Searches</p>
                      <Button variant={"ghost"} size="sm" onClick={()=>clearHistory.mutate()}>
                        <XCircle className="h-4 w-4"/>
                        Clear
                      </Button>
                    </div>
                    {
                      history.map((loc)=>{
                        return <CommandItem
                        key={`${loc.lat}-${loc.lon}`}
                        value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                        onSelect={handleSelect}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{loc.name}</span>
                        {loc.state && <span className="text-sm text-muted-foreground">, {loc.state}</span>}
                        <span className="text-sm text-muted-foreground">, {loc.country}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(loc.searchedAt,"MMM d, h:mm a")}
                        </span>
                      </CommandItem>
                      })
                    }
                  </CommandGroup>
                </>
              )}

              <CommandSeparator />
              {locationNames && locationNames.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {isLoading && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {locationNames.map((loc) => {
                    return (
                      <CommandItem
                        key={`${loc.lat}-${loc.lon}`}
                        value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                        onSelect={handleSelect}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        <span>{loc.name}</span>
                        {loc.state && <span className="text-sm text-muted-foreground">, {loc.state}</span>}
                        <span className="text-sm text-muted-foreground">, {loc.country}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    </>
  );
};

export default CitySearch;
